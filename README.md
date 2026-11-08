# Docker Quiz

Jaiz Microservices Training · QoreBox. A 20-question Docker quiz with a live class leaderboard.

- `/` the quiz. Each answer is sent to the server, and the certificate shows the trainee's position.
- `/leaderboard` the projector view: podium plus full ranking, refreshes every 3 seconds.
- `/leaderboard?key=ADMIN_KEY` the same page with a "Clear all scores" button for the trainer.

Ranking: points, then correct answers, then finished before still playing, then fastest time.
Only the first full attempt counts; "Try again" does not change the leaderboard.

## Run locally

    npm install
    npm start        # http://localhost:3000 (scores saved in data/scores.json)

## Deploy on Render

New → Blueprint → pick this repo. `render.yaml` creates the web service and a free Postgres
database and connects them. The trainer key is generated: see the service's Environment tab, `ADMIN_KEY`.
