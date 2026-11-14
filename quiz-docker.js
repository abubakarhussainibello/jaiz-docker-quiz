// Docker quiz: 20 questions in 4 levels (Jaiz Microservices Training, QoreBox).
// k = base64 of (index of the right option + 7). The page shuffles the options for every player.
(window.QUIZZES = window.QUIZZES || {}).docker = {
  id: "docker",
  title: "Docker Quiz",
  topic: "Docker Essentials",
  eyebrow: "Docker Essentials · Jaiz Bank",
  heading: ["How well do you", "know Docker?"],
  lead: "Twenty questions, four levels. It starts easy and gets harder. Every answer shows you why, and you finish with your own certificate.",
  minutes: "~10",
  certificate: "Docker Essentials",
  what: "completed the Docker quiz of the Jaiz Microservices Training",
  ranks: [
    ["Docker Master", "A perfect score."],
    ["Container Captain", "You really know your containers."],
    ["Image Builder", "Solid work: you can build and run."],
    ["Container Explorer", "Good start: review the ones you missed."],
    ["Docker Beginner", "Everyone starts here: try again after a review."],
  ],
  levels: [
  { name: "Level 1 · Basics", short: "Basics", c: "#00AEFF" },
  { name: "Level 2 · Running containers", short: "Running", c: "#0573FF" },
  { name: "Level 3 · Building images", short: "Building", c: "#3F51D9" },
  { name: "Level 4 · Networks & Compose", short: "Networks", c: "#0B3D91" },
],
  questions: [
  // ---- Level 1: basics
  { l: 0, q: "What is a Docker image?", o: ["A program that is running right now", "A read-only template (a recipe) used to create containers", "A virtual machine with Windows inside", "A screenshot of your desktop"], k: "OA==", w: "An image is the frozen recipe. A <b>container</b> is what runs when you start one from the image." },
  { l: 0, q: "Which command downloads an image without running it?", o: ["<code>docker get python:3.12-slim</code>", "<code>docker download python:3.12-slim</code>", "<code>docker pull python:3.12-slim</code>", "<code>docker run python:3.12-slim</code>"], k: "OQ==", w: "<code>docker pull</code> only downloads. <code>docker run</code> downloads if needed <b>and</b> starts a container." },
  { l: 0, q: "Which command lists the containers that are running now?", o: ["<code>docker ps</code>", "<code>docker images</code>", "<code>docker list</code>", "<code>docker show</code>"], k: "Nw==", w: "<code>docker ps</code> shows running containers. <code>docker images</code> shows the images on your laptop." },
  { l: 0, q: "In <code>python:3.12-slim</code>, what is <code>3.12-slim</code>?", o: ["The container's name", "The registry it comes from", "The port it listens on", "The tag: which version of the image"], k: "MTA=", w: "Name <code>python</code>, tag <code>3.12-slim</code>. No tag means <code>latest</code>, which can change under your feet." },
  { l: 0, q: "<code>docker run hello-world</code> prints <i>Hello from Docker!</i> What does that prove?", o: ["Python is installed on your laptop", "Docker can download an image and run a container on your laptop", "Your app is ready for production", "Kafka is running"], k: "OA==", w: "It is the classic first test: Docker Desktop is running and can pull and run images." },
  // ---- Level 2: running containers
  { l: 1, q: "What does <code>-d</code> do?", code: "docker run -d --name web -p 18080:8000 hello-py", o: ["Deletes the container when it stops", "Runs the container in the background, so you get your terminal back", "Downloads the image again", "Turns on debug mode"], k: "OA==", w: "<code>-d</code> = detached: it runs in the background and prints only the container ID." },
  { l: 1, q: "In <code>-p 18080:8000</code>, which number is the port on <b>your laptop</b>?", o: ["8000", "18080", "Both: they must always be the same", "Neither: ports are chosen at random"], k: "OA==", w: "Laptop : container. You call <code>http://localhost:18080</code>; inside the box the app listens on 8000." },
  { l: 1, q: "You run the same <code>docker run -d --name web ...</code> command twice. The second time you get <i>Conflict. The container name \"/web\" is already in use</i>. What is the fix?", o: ["Restart Docker Desktop", "Reinstall Python", "Remove the old container with <code>docker rm -f web</code>, or choose another name", "Use a different port"], k: "OQ==", w: "Names must be unique. The first <code>web</code> still exists, even if it is stopped." },
  { l: 1, q: "How do you see what the app inside the <code>web</code> container printed?", o: ["<code>docker logs web</code>", "<code>docker print web</code>", "<code>docker images web</code>", "<code>cat web</code>"], k: "Nw==", w: "<code>docker logs web</code> shows everything the app printed. Add <code>-f</code> to keep following new lines." },
  { l: 1, q: "After <code>docker stop web</code>, <code>docker ps</code> no longer shows it. Which command still does?", o: ["<code>docker images</code>", "<code>docker ps -a</code>", "<code>docker logs</code>", "Nothing: the container is gone for good"], k: "OA==", w: "A stopped container still exists. <code>-a</code> = all, running or not. Only <code>docker rm</code> removes it." },
  // ---- Level 3: building images
  { l: 2, q: "In this Dockerfile, which line decides what runs when a container starts?", code: "FROM python:3.12-slim\nWORKDIR /app\nCOPY app.py .\nEXPOSE 8000\nCMD [\"python\", \"app.py\"]", o: ["<code>FROM</code>", "<code>COPY</code>", "<code>EXPOSE</code>", "<code>CMD</code>"], k: "MTA=", w: "<code>CMD</code> is the start command. <code>EXPOSE</code> is only a note saying which port the app uses." },
  { l: 2, q: "What does <code>COPY app.py .</code> do?", o: ["Copies app.py from your folder into the image, into the working directory /app", "Copies app.py from the container back to your laptop", "Downloads app.py from the internet", "Makes a backup of app.py on your laptop"], k: "Nw==", w: "The dot means <i>here</i>, which is <code>/app</code> because of <code>WORKDIR /app</code>." },
  { l: 2, q: "You edit <b>only</b> app.py and run <code>docker build -t hello-py .</code> again. What happens?", o: ["Everything is rebuilt and Python is downloaded again", "<code>FROM</code> and <code>WORKDIR</code> come from the cache; <code>COPY app.py .</code> and the steps after it run again", "Nothing: Docker ignores small changes", "The build fails because the image already exists"], k: "OA==", w: "Docker caches every step. The first step whose input changed, and every step after it, runs again." },
  { l: 2, q: "What is <code>-e GREETING=\"Salam from Jaiz!\"</code>?", code: "docker run -d --name web2 -p 18081:8000 -e GREETING=\"Salam from Jaiz!\" hello-py", o: ["A comment for humans", "The name of the container", "An environment variable: a setting passed into the container, which app.py reads", "An error message"], k: "OQ==", w: "Same image, different setting: <code>curl localhost:18081</code> now answers <i>Salam from Jaiz!</i>, with no rebuild." },
  { l: 2, q: "What does <code>docker exec web python --version</code> do?", o: ["Builds a new image called python", "Runs a command inside the running <code>web</code> container", "Starts a second container", "Upgrades Python on your laptop"], k: "OA==", w: "<code>exec</code> runs an extra command in a container that is already running. It prints <i>Python 3.12.x</i>." },
  // ---- Level 4: networks & compose
  { l: 3, q: "<code>web</code> and a second container are on the same network, <code>jaiz-net</code>. From the second container, which address reaches the app?", o: ["<code>http://localhost:8000</code>", "<code>http://localhost:18080</code>", "<code>http://web:8000</code>", "<code>http://web:18080</code>"], k: "OQ==", w: "On a Docker network, containers find each other <b>by name</b>, on the <b>container</b> port. 18080 only exists on your laptop." },
  { l: 3, q: "Inside the second container, <code>http://localhost:8000</code> gives <i>Connection refused</i>. Why?", o: ["The web app crashed", "Inside a container, <code>localhost</code> means that container itself, and nothing listens on 8000 there", "Port 8000 is blocked by Windows", "You must use HTTPS"], k: "OA==", w: "This is the big trap: <code>localhost</code> is always <i>this box</i>. To reach another container, use its name." },
  { l: 3, q: "<code>docker compose up -d --build</code> answers <i>no configuration file provided: not found</i>. What is wrong?", o: ["Docker Desktop is not running", "The image is missing", "The port is already in use", "You are not in the folder that contains <code>docker-compose.yml</code>"], k: "MTA=", w: "Compose looks for <code>docker-compose.yml</code> in the current folder. <code>cd ~/hello-docker</code> first." },
  { l: 3, q: "In the compose file, <code>checker</code> has <code>depends_on: - web</code>. What does that guarantee?", o: ["That <code>web</code> is fully ready to answer before <code>checker</code> starts", "Only the start order: <code>web</code> is started before <code>checker</code>, but it may not be ready yet", "That both containers use the same image", "That <code>checker</code> restarts when <code>web</code> crashes"], k: "OA==", w: "Start order only. That is why our checker waits 3 seconds before calling <code>http://web:8000</code>." },
  { l: 3, q: "After <code>docker compose stop</code>, <code>web</code> shows <i>Exited (137)</i> after about 10 seconds. What happened?", o: ["The app crashed with a bug", "Docker ran out of disk space", "Docker asked the app to stop, waited 10 seconds because it did not react, then stopped it forcefully", "The image was deleted"], k: "OQ==", w: "Docker first sends a polite stop signal. Our tiny app ignores it, so after 10 s Docker forces it (code 137). Not a crash." },
],
};
