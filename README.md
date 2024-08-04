# Read Me

General test for media transcripts display and edit

## Chrome v FireFox | Bugs & Inconsistencies

Why not notes on Safari? Because its problems seems a bit too unwiedy for me to address.

I. Sometimes, clicking the cue-segment select button appears to misbehave in Chrome. Using **Chrome**, when the time blocks of two cues overlap, the time selection button selects the one with the earliest start time. Also, if the track(s) are set to `mode = "showing"` then the two cues both appear on the video when the second segment is selected. **Firefox**, however, treats each cue separately. Selecting either cue selects the expected segment.

> An example of this "odd" behavior can be seen with "Shortwave: What Chimpanzees..." [*00:03:01 - 00:03:03*] (a) and [*00:03:03 - 00:03:04*] (b): "(a) Can I show you a clip of (b) Oh, yes (a) that (b) please".

The fix was to add a fraction of a second to the start time once I get it before setting the video start time.
