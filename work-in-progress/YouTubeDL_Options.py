
# List of CLI options that (might) come in handy!
 
"""

The CLI options for yt_dlp, that might be useful:

    --ignore-errors / -i :
        Ignore download and postprocessing errors.

    --no-abort-on-error :
        Continue with next video on download errors;
        e.g. to skip unavailable videos in a playlist (default)

    --simulate / -s :
        Do not download the video and do not write anything to disk.

"""
"""

Video Selection: https://github.com/yt-dlp/yt-dlp#video-selection

    --flat-playlist :
        List videos in a given playlist

    --playlist-items ITEM_SPEC / -I ITEM_SPEC :
        Select Videos to Download from Playlist.
        ITEM_SPEC is the (comma-spaced) indices of the videos
        from the playlist to download. Can be expressed as a range, in
        Pythonic Format (Start:Stop:Step)

"""
"""

Filesystem Options: https://github.com/yt-dlp/yt-dlp#filesystem-options

    --batch_file FILE / -a FILE :
        A text file containing URLs to download, with one URL at each line.
        "#", ";", "]" render a line as a text comment.

    --paths [TYPES:]PATH / -P [TYPES:]PATH :
        Specifies which file to move the downloaded media to.
        [TYPES:] specifies the nature of the files stored. It can also be
        registered as a "home" or "temp" folder.

    --output [TYPES:]TEMPLATE / -o [TYPES:]TEMPLATE :
        Specifies the filename, as well as the file type, of the downloaded
        media. These include video, audio, thumbnail, subtitles, descriptions
        etc.

    --write-description:
        Write video description to a ".description" file.

    --write-info-json:
        Write video metadata to a ".info.json" file.
        Note, this may contain personal information...

    --write-comments / --get-comments:
        Record video comments in the infojson file.

"""
"""

Thumbnail Options: https://github.com/yt-dlp/yt-dlp#thumbnail-options

    --write-thumbnail:
        Write thumbnail image to disk.

    --write-all-thumbnails:
        Write all thumbnail image formats to disk.

    --list-thumbnails:
        List available thumbnails of each video.

"""
"""

Video Format Options: https://github.com/yt-dlp/yt-dlp#video-format-options

    --format FORMAT / -f FORMAT :
        Sets the video file format + quality. For examples of usage,
        check: https://github.com/yt-dlp/yt-dlp#format-selection-examples

    --list-formats / -F :
        List available formats of each video.
        
"""
"""

Subtitle Options: https://github.com/yt-dlp/yt-dlp#subtitle-options

    --write-subs :
        Write subtitle file.

    --write-auto-subs :
        Write automatically generated subtitle file.

    --list-subs :
        List available subtitles of each video.

    --sub-langs LANGS :
        Languages of the subtitles to download (can be regex) or "all"
        separated by commas,
        e.g. --sub-langs "en.*,ja".
        You can prefix the language code with a "-" to exclude it from
        the requested languages,
        e.g. --sub-langs all,-live_chat.

"""
"""

Post-Processing Options: https://github.com/yt-dlp/yt-dlp#post-processing-options

    --extract-audio / -x :
        Convert video files to audio-only files.
        Requires ffmpeg and ffprobe.
    
    --audio-format FORMAT :
        Format to convert the audio to when -x is used.
        Supported Audio Formats: best (default),
        aac, alac, flac, m4a, mp3, opus, vorbis, wav

    --ffmpeg-location PATH :
        Location of the ffmpeg binary.
        It can be either the path to the binary file or
        its containing directory.

    --convert-subs FORMAT / --convert-subtitles FORMAT :
        Convert the subtitles to another format.
        Supported Subtitle Formats: ass, lrc, srt, vtt

    --convert-thumbnails FORMAT :
        Convert the thumbnails to another format
        Support Image Formats: jpg, png, webp
        You can specify multiple rules using similar syntax as --remux-video.
    
    --split-chapters :
        Split video into multiple files based on internal chapters.
        The "chapter:" prefix can be used with "--paths" and "--output"
        to set the output filename for the split files.
        See "OUTPUT TEMPLATE" for details..

"""
