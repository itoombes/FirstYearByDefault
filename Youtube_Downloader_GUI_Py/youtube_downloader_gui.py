import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import yt_dlp
import threading
import re

def validate_url(url):
    return url.startswith('http://') or url.startswith('https://')

def download():
    url = url_entry.get()
    is_audio = audio_var.get()

    if not validate_url(url):
        messagebox.showerror("Invalid URL", "Please enter a valid YouTube URL.")
        return

    ydl_opts = {
        'ffmpeg_location': './ffmpeg-6.0-essentials_build/bin/',
        'progress_hooks': [hook],
        'format': 'bestaudio/best' if is_audio else 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    messagebox.showinfo("Download Complete", "Your file has been downloaded.")
    status_label.config(text='Status: N/A')
    url_entry.delete(0, tk.END)

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    messagebox.showinfo("Download Complete", "Your file has been downloaded.")
    url_entry.delete(0, tk.END)

def hook(d):
    if d['status'] == 'downloading':
        p = d.get('_percent_str', '0.0%')
        speed = d.get('_speed_str', 'N/A')
        eta = d.get('_eta_str', 'N/A')
        status_text = f"Progress: {p}, Speed: {speed}, ETA: {eta}"
        status_label.config(text=status_text)
    elif d['status'] == 'finished':
        status_label.config(text='Download Complete')


def on_entry_click(event):
    if url_entry.get() == 'Enter YouTube URL here':
        url_entry.delete(0, tk.END)
        url_entry.config(fg='black')

def on_entry_change(*args):
    url = url_var.get()
    if validate_url(url):
        url_entry.config(highlightbackground="green")
    else:
        url_entry.config(highlightbackground="red")

# GUI Setup
window = tk.Tk()
window.title('YouTube Downloader')

#Heading
title_label = tk.Label(window, text='YouTube Downloader')
title_label.grid(row=0, column=0, columnspan=2, pady=10)

#Status bar
status_label = tk.Label(window, text='Status: N/A')
status_label.grid(row=5, column=0, columnspan=2, pady=10)

url_var = tk.StringVar()
url_var.trace_add("write", on_entry_change)

url_entry = tk.Entry(window, textvariable=url_var, fg='grey', width=50)
url_entry.grid(row=1, column=0, columnspan=2, pady=10)

url_entry.insert(0, 'Enter YouTube URL here')
url_entry.bind('<FocusIn>', on_entry_click)

#Audio tick box
audio_var = tk.IntVar()
audio_check = tk.Checkbutton(window, text='Download as Audio', variable=audio_var)
audio_check.grid(row=2, column=0, columnspan=2, pady=10)

#Download button
download_button = ttk.Button(window, text='Download', command=lambda: threading.Thread(target=download).start())
download_button.grid(row=3, column=0, columnspan=2, pady=10)

window.mainloop()