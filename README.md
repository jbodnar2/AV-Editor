# Read Me

General test for media transcripts display and edit

## Chrome v FireFox | Bugs & Inconsistencies

Using Chrome if two consecutive segments had the same start and end time (or overlapped in time), clicking the second segment's time-selection button on the UI would either select the first segment or do nothing. My guess was that Chrome would in some way combine the two cues into one as it processed them and in some way throw off the time-selection functionality. The "fix" was to add a fraction of a second to the startTime I wanted to set the video to in the editor's `setToTime()` function. Firefox did not exhibit this problem and operated as I expected it to operate.

Regarding the editor's `handleTextChange()` function, using Firefox, updating the text of an active cue also updates the text of the caption if it is currently showing. Using Chrome the caption display does not change. (I'm unable to find a way to address this.)
