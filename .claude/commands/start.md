Start the Docusaurus development server for this project.

1. Check if a Docusaurus dev server is already running (`ps aux | grep docusaurus`). If one is running, tell the user and provide the URL (http://localhost:3000/showcase-site/) rather than starting a second one.
2. If no server is running, start it using Node 20 via nvm:
   ```
   export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use 20 && cd website && npm run start
   ```
   Run this as a background task from the repo root.
3. Wait for the "[SUCCESS] Docusaurus website is running" message to confirm it started.
4. Tell the user the server is running at http://localhost:3000/showcase-site/
