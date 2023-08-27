import tkinter as tk
from tkinter import *
from tkinter import ttk
import yt_dlp
from yt_dlp import *

def on_button_click() :

    if audio_var.get() :
        URLS = [input_box.get()]

        ydl_opts = {
            'format': 'm4a/bestaudio/best',
            # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
            'postprocessors': [{  # Extract audio using ffmpeg
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
            }]
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            error_code = ydl.download(URLS)

    else :
        URLS = [input_box.get()] 
        with YoutubeDL() as ydl:
            ydl.download(URLS)

root = Tk()
root.title("Youtube Downloader")
frame = ttk.Frame(root, padding=10)
frame.grid()

#Title
title_label = ttk.Label(frame, text="Enter YouTube Link", font="40")
title_label.grid(column=1, row=0)

#Input box
input_box = ttk.Entry(frame, width="40", font=("italic", "10"))
input_box.grid(column=1, row=1)

#Audio only button
audio_var = tk.IntVar()
audio_check = tk.Checkbutton(frame, text='Download as Audio', variable=audio_var)
audio_check.grid(row=2, column=0, columnspan=2, pady=10)

#Download button
download_button = ttk.Button(frame, text="Download", command=on_button_click)
download_button.grid(column=1, row=3)

root.mainloop()

#print(download_button.configure().keys())