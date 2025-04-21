document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const output = document.getElementById('output');
  const cursor = document.querySelector('.cursor');
  const terminalBody = document.querySelector('.terminal-body');

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

  // Add scroll indicator animation
  function animateScrollIndicator() {
    terminalBody.classList.add('scrolling');

    // Remove the class after the animation completes
    setTimeout(() => {
      terminalBody.classList.remove('scrolling');
    }, 1000);
  }

  // Handle keyboard input
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();

      if (command !== '') {
        // Add command to history
        commandHistory.push(command);
        historyIndex = commandHistory.length;

        // Add the command to output
        addToOutput(`<span class="prompt">root@lpossamai.me:~$</span> ${command}`);

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

  // Add text to terminal output with improved auto-scrolling
  function addToOutput(text) {
    const line = document.createElement('div');
    line.innerHTML = text;

    // Add the new-line class for animation
    line.classList.add('new-line');
    output.appendChild(line);

    // Ensure the scroll happens after the DOM is updated and content is rendered
    setTimeout(() => {
      // Always show scroll indicator and smoothly scroll to the bottom
      animateScrollIndicator();
      terminalBody.scrollTo({
        top: terminalBody.scrollHeight,
        behavior: 'smooth'
      });

      // Remove the animation class after it completes
      setTimeout(() => {
        line.classList.remove('new-line');
      }, 1000);
    }, 10);
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
            <br>- <strong>contact</strong>: Get in touch with me
            <br>- <strong>social</strong>: Show my social media profiles
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
            <p>Hi, I'm Lucas Possamai! I'm a DevOps/Platform Engineer with a passion for crafting elegant, scalable solutions to complex challenges.</p>
            <p>Bootstrapping well-architected PCI-DSS and ISO/IEC 27001 compliant AWS Cloud environments, migrating workloads to AWS, and utilising Infrastructure as Code (IaC) for automated resource deployment. Designing, architecting, and building solutions. Assessing and automating AWS processes, enabling emerging technology projects, and fostering DevOps, and Agile practices. opportunities that challenge me to deliver scalable, secure, and efficient cloud solutions.</p>
            <p>When I'm not optimizing cloud environments, you'll find me gaming on my PS5, playing drums, or diving into science fiction novels. I'm also a motorsport enthusiast, often spotted at car shows or track days.</p>
            <p>Type 'skills' to see my technical expertise or 'projects' to view my portfolio.</p>
        </div>
      `;
    },

    skills: function () {
      return `
        <div class="command-output">
            <h2>Technical Skills</h2>
            <div class="skill-category">
                <h3>Cloud Platforms:</h3>
                <p>AWS, Azure</p>
            </div>
            <div class="skill-category">
                <h3>DevOps Tools:</h3>
                <p>Terraform, Ansible, Docker, Kubernetes, Jenkins, Gitlab CI/CD, GitHub Actions, Capistrano, Puppet, Terragrunt</p>
            </div>
            <div class="skill-category">
                <h3>Monitoring & Logging:</h3>
                <p>Prometheus, Grafana, New Relic, ELK (Elasticsearch, Logstash, Kibana)</p>
            </div>
            <div class="skill-category">
                <h3>Databases:</h3>
                <p>PostgreSQL, MySQL, Oracle</p>
            </div>
            <div class="skill-category">
                <h3>Programming Languages:</h3>
                <p>Python, SQL</p>
            </div>
        </div>
      `;
    },

    experience: function () {
      return `
        <div class="command-output">
            <h2>Work Experience</h2>
            <div class="experience-item">
                <h3>Senior Platform Engineer | Flo2Cash</h3>
                <p class="date">April 2024 - Present</p>
                <ul>
                    <li>Designed and deployed secure, scalable AWS infrastructure for payment systems, ensuring compliance with PCI-DSS and ISO 27001 standards.</li>
                    <li>Automated infrastructure deployment using CloudFormation, Terraform, and AWS CDK, reducing deployment times and improving efficiency.</li>
                    <li>Implemented monitoring and troubleshooting using Prometheus, Grafana, and ELK stack to ensure high availability and performance.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior DevOps Engineer | Flux Federation</h3>
                <p class="date">July 2023 - December 2023</p>
                <ul>
                    <li>Designed, architected, and deployed secure, ISO/IEC 27001, PCI-DSS, and CIS-compliant applications and infrastructure on AWS using Terraform, Terragrunt, Gitlab, and Capistrano.</li>
                    <li>Automated infrastructure deployment processes, reducing manual intervention and improving deployment efficiency.</li>
                    <li>Utilized monitoring tools like Prometheus, Grafana, New Relic, and ELK stack to ensure system performance and reliability.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior DevSecOps Engineer | Glorious</h3>
                <p class="date">April 2023 - July 2023</p>
                <ul>
                    <li>Designed and deployed ISO/IEC 27001, PCI-DSS, and CIS-compliant applications and infrastructure on AWS using Terraform and GitHub Actions.</li>
                    <li>Automated infrastructure provisioning and deployment processes, improving efficiency and reducing manual errors.</li>
                    <li>Collaborated with cross-functional teams to maintain and optimize cloud environments in a fully remote setting.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior DevOps Engineer | Leaven (Spark CCL)</h3>
                <p class="date">August 2022 - April 2023</p>
                <ul>
                    <li>Architected and deployed ISO/IEC 27001, PCI-DSS, and CIS-compliant applications and infrastructure on AWS using Terraform and Azure DevOps.</li>
                    <li>Spearheaded the deployment of PCI-DSS-compliant Landing Zone accounts and Spoke networks, leveraging Azure DevOps, Terraform, and Docker.</li>
                    <li>Dockerized core applications and deployed them to AWS ECS, enhancing scalability and reducing operational overhead.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior DevOps Engineer | Flux Federation</h3>
                <p class="date">April 2022 - August 2022</p>
                <ul>
                    <li>Designed and deployed secure, ISO/IEC 27001, PCI-DSS, and CIS-compliant infrastructure on AWS using Terraform, Gitlab, and Capistrano.</li>
                    <li>Implemented AWS Shield Advanced and AWS Global Accelerator to provide robust DDoS protection for critical applications.</li>
                    <li>Automated infrastructure deployment processes, reducing manual intervention and improving operational efficiency.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior Cloud Engineer | Bank of New Zealand</h3>
                <p class="date">October 2021 - April 2022</p>
                <ul>
                    <li>Architected and deployed a PCI-DSS compliant transaction monitoring solution on AWS EKS.</li>
                    <li>Implemented AWS Shield Advanced and Global Accelerator for robust DDoS protection.</li>
                    <li>Dockerized core applications and deployed them to AWS EKS, enhancing scalability and resource efficiency.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior AWS DevOps Engineer | GeoOp</h3>
                <p class="date">April 2021 - October 2021</p>
                <ul>
                    <li>Migrated core PHP application to AWS ECS Fargate, improving scalability and reducing operational costs.</li>
                    <li>Enhanced onboarding efficiency by 30% by mentoring junior DevOps engineers on cloud practices.</li>
                    <li>Implemented AWS CloudFront, WAF, and Shield for enhanced DDoS protection and application scalability.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior Platform Engineer | RedShield</h3>
                <p class="date">January 2021 - April 2021</p>
                <ul>
                    <li>Designed and implemented a secure, scalable PCI and ISO/IEC 27001-compliant AWS infrastructure using Terraform, AWS Global Accelerator, EKS, and Shield Advanced.</li>
                    <li>Automated on-premises infrastructure management using Puppet and GitLab CI/CD pipelines.</li>
                    <li>Conducted security incident response, including investigation and mitigation, to maintain infrastructure integrity.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>Senior Cloud Engineer | Trade Me</h3>
                <p class="date">January 2018 - January 2021</p>
                <ul>
                    <li>Led the migration of on-premises infrastructure to AWS with only 90 minutes of planned downtime.</li>
                    <li>Automated deployment of PCI-DSS and CIS compliant AWS infrastructure using Ansible and Terraform.</li>
                    <li>Implemented monitoring solutions with New Relic to ensure system reliability and performance.</li>
                </ul>
            </div>
            <div class="experience-item">
                <h3>AWS Cloud Engineer | GeoOp</h3>
                <p class="date">December 2015 - January 2018</p>
                <ul>
                    <li>Migrated entire platform from Rackspace to AWS Cloud with only 90 minutes of downtime.</li>
                    <li>Migrated BLOB data from PostgreSQL to AWS S3, reducing database size from >5 TB to <800 GB and cutting costs by 40%.</li>
                    <li>Documented best practices for development and deployment, ensuring consistency and compliance across the organization.</li>
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
                <h3>Electronic Engineering</h3>
                <p>Universidade de Caxias do Sul | 2012 - 2014</p>
            </div>
            <div class="education-item">
                <h3>Certifications</h3>
                <ul>
                    <li>AWS Certified Solutions Architect - Associate</li>
                    <li>HashiCorp Certified: Terraform Associate</li>
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
                <h3><a href="https://dev.to/lpossamai" target="_blank">Technical Blog</a></h3>
                <p>Articles on cloud computing, DevOps practices, and infrastructure automation.</p>
                <p class="tech-stack">AWS | DevOps | Cloud Security</p>
            </div>
            <p>Explore my open-source contributions and personal projects on <a href="https://github.com/lpossamai" target="_blank">GitHub</a>.</p>
        </div>
      `;
    },

    contact: function () {
      return `
        <div class="command-output">
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> <a href="mailto:root@lpossamai.me">root@lpossamai.me</a></p>
            <p><strong>Location:</strong> Auckland, New Zealand</p>
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
                <li><strong>GitHub:</strong> <a href="https://github.com/lpossamai" target="_blank">github.com/lpossamai</a></li>
                <li><strong>Dev.to:</strong> <a href="https://dev.to/lpossamai" target="_blank">dev.to/lpossamai</a></li>
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
