THE ORIGIN — THE CODE & THE BLADE

Open index.html in a modern browser. This file embeds the renderer, models, styling and game logic; no installation or internet connection is needed. WebGL is required for the 3D view. If it is unavailable, the narrative, lessons and duel remain playable with a static fallback.

PLAY
You play Abdul, an apprentice learning from a sensei. Visit the modeled dojo, lantern garden and scroll archive. Practice one Python, JavaScript and SQL form, then enter the sword duel. These are introductory exercises, not full language courses.

Enter the requested complete line and press Enter or Strike. Correct code lands a hit and reduces the sensei's guard. An incorrect submission or timeout makes Abdul miss, receive a counterstrike, and lose one health. Each fighter starts with three. A win reveals the portfolio; a loss offers retry or review. Code is checked against lesson rules, never executed.

OPTIONS
Story: 20 seconds per strike. Relaxed: 35 seconds. Practice: no timer. Training is always untimed. Pause/Help freezes the timer and displays the current lesson. Switching tabs and opening the portfolio also pause the duel. Motion can be disabled, and system reduced-motion settings are honored.

INTERACTION
Click lanterns, the reflecting pool, scrolls or gong to inspect them. Inspect the set provides a keyboard-accessible description. Look Around enables dragging or arrow-key camera movement. All lessons and strikes use standard keyboard/touch controls. Recruiters can open Portfolio at any time.

ART & SOURCE
Original low-poly 3D geometry includes the mountain landscape, dojo, torii, garden, pool, bridge, archive and both swordsmen. The protagonist is a stylized stand-in, not a likeness. Three.js 0.160.1 is vendored under the included MIT license. Source files and Node tests are in source/. No server or build process is required.

VALIDATION
Passed: syntax; complete story progression; correct-answer win; wrong-answer and timeout loss; duplicate and late submissions; pauses, hidden tabs, replay and untimed mode. The actual Three.js scene builds 413 meshes; all camera targets, attack paths, reduced motion and desktop/mobile character framing passed geometry checks. Offline geometry previews were inspected and camera obstructions corrected. Browser/GPU visual rendering and real-device touch interaction have NOT been verified: browser policy blocks automated access to this local-file preview.

Run checks from source/: node test-rules.cjs, node test-story.cjs, node test-world.cjs.
