# Jaiz Quizzes

Jaiz Microservices Training · QoreBox. Two 20-question quizzes, each with its own live class leaderboard.

- `/` the Docker quiz (questions in `quiz-docker.js`).
- `/platform` the platform quiz: 10 theory + 10 practical on the Dockerfile, docker-compose.yml and kong.yml (questions in `quiz-platform.js`).
- `/leaderboard?quiz=docker` or `/leaderboard?quiz=platform` the projector view, with tabs to switch.

- Each answer is sent to the server, and the certificate shows the trainee's position.
- The leaderboard shows a podium plus the full ranking and refreshes every 3 seconds.
- Add `&key=ADMIN_KEY` to the leaderboard address for a "Clear all scores for this quiz" button.

Ranking: points, then correct answers, then finished before still playing, then fastest time.
Only the first full attempt counts; "Try again" does not change the leaderboard.

## Run locally

    npm install
    npm start        # http://localhost:3000 (scores saved in data/scores.json)

## Deploy on Render

New → Blueprint → pick this repo. `render.yaml` creates the web service and a free Postgres
database and connects them. The trainer key is generated: see the service's Environment tab, `ADMIN_KEY`.
