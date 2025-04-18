document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const output = document.getElementById('output');
  const cursor = document.querySelector('.cursor');

  // Apply saved theme settings
  applyThemeSettings();

  // Focus the input on page load
  terminalInput.focus();

  // Keep focus on input when clicking anywhere in the terminal
  document.querySelector('.terminal-container').addEventListener('click', () => {
    terminalInput.focus();
  });

  // Re-focus input if it loses focus
  terminalInput.addEventListener('blur', () => {
    setTimeout(() => {
      terminalInput.focus();
    }, 10);
  });

  // Update cursor position as user types
  terminalInput.addEventListener('input', updateCursorPosition);

  function updateCursorPosition() {
    const textWidth = getTextWidth(terminalInput.value, getComputedStyle(terminalInput).font);
    cursor.style.left = `${textWidth}px`;
  }

  // Helper function to calculate text width
  function getTextWidth(text, font) {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  // Theme settings
  function applyThemeSettings() {
    // Check for saved theme in localStorage
    const savedMode = localStorage.getItem('terminalMode') || 'dark';
    const savedColor = localStorage.getItem('terminalColor') || 'default';

    // Apply saved themes
    document.body.classList.add(`theme-${savedMode}`);
    document.body.classList.add(`theme-${savedColor}`);

    // Add mode switcher button
    addModeSwitcher(savedMode);
  }

  // Add mode switcher button
  function addModeSwitcher(currentMode) {
    const header = document.querySelector('.terminal-header');
    const button = document.createElement('button');
    button.className = 'mode-switcher';
    button.innerHTML = currentMode === 'dark' ? '☀️' : '🌙';
    button.setAttribute('aria-label', currentMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    button.onclick = toggleDarkLightMode;
    header.appendChild(button);
  }

  // Toggle between dark and light mode
  function toggleDarkLightMode() {
    const isDarkMode = document.body.classList.contains('theme-dark');
    const button = document.querySelector('.mode-switcher');

    // Toggle classes
    document.body.classList.remove(isDarkMode ? 'theme-dark' : 'theme-light');
    document.body.classList.add(isDarkMode ? 'theme-light' : 'theme-dark');

    // Update button
    button.innerHTML = isDarkMode ? '🌙' : '☀️';
    button.setAttribute('aria-label', isDarkMode ? 'Switch to dark mode' : 'Switch to light mode');

    // Save preference
    localStorage.setItem('terminalMode', isDarkMode ? 'light' : 'dark');

    // Notify user
    addToOutput(`<div class="command-output">Switched to ${isDarkMode ? 'light' : 'dark'} mode.</div>`);
  }

  // Command history functionality
  let commandHistory = [];
  let historyIndex = -1;

  // Handle keyboard input
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();

      if (command !== '') {
        // Add command to history
        commandHistory.push(command);
        historyIndex = commandHistory.length;

        // Add the command to output
        addToOutput(`<span class="prompt">visitor@portfolio:~$</span> ${command}`);

        // Process the command
        processCommand(command);

        // Clear the input
        terminalInput.value = '';

        // Reset cursor position
        cursor.style.left = '0';
      }
    } else if (e.key === 'ArrowUp') {
      // Navigate command history (up)
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
        updateCursorPosition();
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate command history (down)
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      updateCursorPosition();
    }
  });

  // Add text to terminal output
  function addToOutput(text) {
    const line = document.createElement('div');
    line.innerHTML = text;
    output.appendChild(line);

    // Scroll to bottom of output
    output.scrollTop = output.scrollHeight;
  }

  // Command functions
  const commands = {
    help: function () {
      return `
        <div class="command-output">
            Available commands:
            <br>- <strong>help</strong>: Display available commands
            <br>- <strong>about</strong>: Display information about me
            <br>- <strong>skills</strong>: List my technical skills
            <br>- <strong>experience</strong>: Show my work experience
            <br>- <strong>education</strong>: Show my educational background
            <br>- <strong>projects</strong>: View my projects
            <br>- <strong>contact</strong>: Display contact information
            <br>- <strong>social</strong>: Show my social media profiles
            <br>- <strong>download</strong>: Download my resume
            <br>- <strong>clear</strong>: Clear the terminal
            <br>- <strong>theme</strong>: Change the terminal color theme
            <br>- <strong>mode</strong>: Toggle between dark and light mode
        </div>
      `;
    },

    about: function () {
      return `
        <div class="command-output">
            <h2>About Me</h2>
            <p>Hi, I'm Lucas Possamai! I'm a Software Engineer with a passion for creating elegant solutions to complex problems.</p>
            <p>I specialize in full-stack development with a focus on scalable architectures and user-centered design.</p>
            <p>When not coding, I enjoy hiking, reading science fiction, and experimenting with new technologies.</p>
            <p>Type 'skills' to see my technical expertise or 'projects' to view my portfolio.</p>
        </div>
      `;
    },

    skills: function () {
      return `
        <div class="command-output">
            <h2>Technical Skills</h2>
            <div class="skill-category">
                <h3>Programming Languages:</h3>
                <p>JavaScript, TypeScript, Python, Java, Go, HTML5, CSS3, SQL</p>
            </div>
            <div class="skill-category">
                <h3>Frontend:</h3>
                <p>React, Vue.js, Angular, Redux, Webpack, Sass, Tailwind CSS</p>
            </div>
            <div class="skill-category">
                <h3>Backend:</h3>
                <p>Node.js, Express, Django, Spring Boot, GraphQL</p>
            </div>
            <div class="skill-category">
                <h3>Databases:</h3>
                <p>MongoDB, PostgreSQL, MySQL, Redis, Firebase</p>
            </div>
            <div class="skill-category">
                <h3>DevOps & Tools:</h3>
                <p>Docker, Kubernetes, AWS, GCP, CI/CD, Git, GitHub Actions, Jest, Cypress</p>
            </div>
        </div>
      `;
    },

    experience: function () {
      return `
        <div class="command-output">
            <h2>Work Experience</h2>
            <div class="experience-item">
                <h3>Senior Software Engineer | Tech Innovation Inc.</h3>
                <p class="date">Jan 2020 - Present</p>
                <ul>
                    <li>Lead development of microservices architecture serving 1M+ users</li>
                    <li>Implemented CI/CD pipelines reducing deployment time by 40%</li>
                    <li>Mentored junior developers and conducted code reviews</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Full Stack Developer | Digital Solutions Ltd.</h3>
                <p class="date">Mar 2017 - Dec 2019</p>
                <ul>
                    <li>Built responsive web applications using React and Node.js</li>
                    <li>Optimized database queries improving performance by 30%</li>
                    <li>Collaborated with design team on UX improvements</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Web Developer Intern | StartUp Hub</h3>
                <p class="date">Jun 2016 - Feb 2017</p>
                <ul>
                    <li>Developed features for e-commerce platform</li>
                    <li>Created data visualization components</li>
                </ul>
            </div>
        </div>
      `;
    },

    education: function () {
      return `
        <div class="command-output">
            <h2>Education</h2>
            <div class="education-item">
                <h3>Master of Computer Science</h3>
                <p>University of Technology | 2015 - 2017</p>
                <p>Specialization in Software Engineering</p>
            </div>
            <div class="education-item">
                <h3>Bachelor of Science in Computer Science</h3>
                <p>State University | 2011 - 2015</p>
                <p>Minor in Mathematics</p>
            </div>
            <div class="education-item">
                <h3>Certifications</h3>
                <ul>
                    <li>AWS Certified Solutions Architect</li>
                    <li>Google Cloud Professional Data Engineer</li>
                    <li>Certified Kubernetes Administrator</li>
                </ul>
            </div>
        </div>
      `;
    },

    projects: function () {
      return `
        <div class="command-output">
            <h2>Projects</h2>
            <div class="project-item">
                <h3><a href="#" target="_blank">E-Commerce Platform</a></h3>
                <p>A full-featured online shopping platform built with React, Node.js, and MongoDB.</p>
                <p class="tech-stack">React | Node.js | Express | MongoDB | Stripe API</p>
            </div>
            <div class="project-item">
                <h3><a href="#" target="_blank">Real-Time Analytics Dashboard</a></h3>
                <p>Interactive dashboard for visualizing business metrics with real-time updates.</p>
                <p class="tech-stack">Vue.js | D3.js | Socket.io | Express | PostgreSQL</p>
            </div>
            <div class="project-item">
                <h3><a href="#" target="_blank">AI-Powered Task Manager</a></h3>
                <p>Task management application with AI-driven prioritization and scheduling.</p>
                <p class="tech-stack">React | Python | Django | TensorFlow | PostgreSQL</p>
            </div>
            <div class="project-item">
                <h3><a href="#" target="_blank">Cloud Infrastructure Toolkit</a></h3>
                <p>Open-source toolkit for automating cloud infrastructure deployment.</p>
                <p class="tech-stack">Go | Terraform | AWS | Docker | GitHub Actions</p>
            </div>
            <p>View more on my <a href="https://github.com/yourusername" target="_blank">GitHub</a></p>
        </div>
      `;
    },

    contact: function () {
      return `
        <div class="command-output">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> <a href="mailto:lucas@example.com">lucas@example.com</a></p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Location:</strong> San Francisco, CA</p>
            <p>Feel free to reach out for project inquiries, collaboration opportunities, or just to say hello!</p>
        </div>
      `;
    },

    social: function () {
      return `
        <div class="command-output">
            <h2>Social Media & Profiles</h2>
            <ul class="social-links">
                <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lucaspossamai" target="_blank">linkedin.com/in/lucaspossamai</a></li>
                <li><strong>GitHub:</strong> <a href="https://github.com/lucaspossamai" target="_blank">github.com/lucaspossamai</a></li>
                <li><strong>Twitter:</strong> <a href="https://twitter.com/lucaspossamai" target="_blank">@lucaspossamai</a></li>
                <li><strong>Dev.to:</strong> <a href="https://dev.to/lucaspossamai" target="_blank">dev.to/lucaspossamai</a></li>
                <li><strong>Medium:</strong> <a href="https://medium.com/@lucaspossamai" target="_blank">@lucaspossamai</a></li>
            </ul>
        </div>
      `;
    },

    download: function () {
      return `
        <div class="command-output">
            <h2>Resume Download</h2>
            <p>You can download my resume in the following formats:</p>
            <ul class="download-links">
                <li><a href="resume/lucas-possamai-resume.pdf" download>PDF Version</a></li>
                <li><a href="resume/lucas-possamai-resume.docx" download>Word Document</a></li>
            </ul>
        </div>
      `;
    },

    theme: function (args) {
      // If an argument is provided, set the theme
      if (args && args.length > 0) {
        const selectedTheme = args[0].toLowerCase();
        const validThemes = ['default', 'blue', 'purple', 'amber', 'pink'];

        if (validThemes.includes(selectedTheme)) {
          // Remove any existing color theme
          validThemes.forEach(theme => {
            document.body.classList.remove(`theme-${theme}`);
          });

          // Apply the new theme
          document.body.classList.add(`theme-${selectedTheme}`);

          // Save to localStorage
          localStorage.setItem('terminalColor', selectedTheme);

          return `
            <div class="command-output">
                Theme changed to ${selectedTheme}. Type 'theme' to see all available themes.
            </div>
          `;
        } else {
          return `
            <div class="command-output">
                Invalid theme: ${selectedTheme}. Type 'theme' to see all available themes.
            </div>
          `;
        }
      }

      // If no argument, show theme options
      return `
        <div class="command-output">
            <h2>Change Theme</h2>
            <p>Available color themes:</p>
            <ul class="theme-options">
                <li><a href="#" class="theme-link" data-theme="default">Default (Green)</a></li>
                <li><a href="#" class="theme-link" data-theme="blue">Blue</a></li>
                <li><a href="#" class="theme-link" data-theme="purple">Purple</a></li>
                <li><a href="#" class="theme-link" data-theme="amber">Amber</a></li>
                <li><a href="#" class="theme-link" data-theme="pink">Pink</a></li>
            </ul>
            <p>You can also directly type: 'theme blue', 'theme purple', etc.</p>
            <p>To toggle between dark and light mode, type 'mode' or click the mode button in the top right.</p>
        </div>
      `;
    },

    mode: function () {
      // Use the same function as the mode switcher button
      toggleDarkLightMode();
      return ''; // Return nothing because the toggle function already adds output
    },

    clear: function () {
      output.innerHTML = '';
      return '';
    }
  };

  // Handle theme changes via clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('theme-link')) {
      e.preventDefault();
      const theme = e.target.getAttribute('data-theme');

      // Get all theme options
      const validThemes = ['default', 'blue', 'purple', 'amber', 'pink'];

      // Remove any existing color theme
      validThemes.forEach(t => {
        document.body.classList.remove(`theme-${t}`);
      });

      // Apply the new theme
      document.body.classList.add(`theme-${theme}`);

      // Save to localStorage
      localStorage.setItem('terminalColor', theme);

      // Notify user
      addToOutput(`<div class="command-output">Theme changed to ${theme}.</div>`);
    }
  });

  // Process commands
  function processCommand(command) {
    const cmd = command.toLowerCase().trim();

    // Split command and arguments (for future use with more complex commands)
    const parts = cmd.split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1);

    if (commands[mainCommand]) {
      const result = commands[mainCommand](args);
      if (result) {
        addToOutput(result);
      }
    } else {
      addToOutput(`<div class="command-output">Command not found: ${command}. Type 'help' for available commands.</div>`);
    }
  }

  // Initialize cursor position
  updateCursorPosition();
});
