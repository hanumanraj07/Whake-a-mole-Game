🐹 Whack-a-Mole

A fast-paced browser Whack-a-Mole game built with HTML, CSS, and JavaScript. Moles pop up randomly — click them before they disappear to score points. Includes timer-based rounds, score tracking, difficulty options, and simple animations.

🔹 Short Description

Hit as many moles as you can before the timer runs out. The game tests your reaction speed with randomly appearing moles, real-time score updates, and increasing difficulty options.

🚀 Features

⏱ Timed Rounds — play against a countdown timer

🎯 Score Tracking — points awarded for each mole hit

⚡ Random Mole Spawns — moles appear in random holes for short durations

🔁 Round Restart / Play Again button

🔀 Difficulty Levels (e.g., Easy / Hard) to change spawn rate and mole visibility time

✨ Animations when moles pop up and when they are whacked

🔊 (Optional) Sound effects for hit / miss

📱 Mobile-friendly controls (tap to hit)

🕹 Controls

Click / Tap a mole to score points

Start / Restart to begin a new round

Change difficulty to adjust challenge

🧠 How It Works (Logic Summary)

Game initializes a grid of holes (DOM elements).

At random intervals, a mole element becomes visible in a random hole.

The mole stays visible for a limited time; if clicked while visible, the player scores points and the mole hides.

The round ends when the timer reaches zero. Final score is displayed.

Difficulty modes alter spawn frequency and visibility duration.
