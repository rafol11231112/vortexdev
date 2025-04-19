# Full-Stack Developer Portfolio

A modern, responsive portfolio website designed for full-stack developers to showcase their skills, projects, and experience. This portfolio was inspired by the Hydro portfolio design.

## Features

- Modern, dark-themed UI with particle animations
- Interactive terminal-style hero section
- Responsive layout that works on all devices
- Project showcase with detailed view
- Online profiles section
- Contact form
- Tech stack display

## Technologies Used

- HTML5
- CSS3 (with custom properties, flexbox, and grid)
- JavaScript (ES6+)
- Font Awesome icons
- Python (for local development server)

## Getting Started

### Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge recommended)
- Python 3.x installed on your system

### Running the Portfolio Locally

#### Option 1: Using the provided scripts (recommended)

**Windows:**
- Double-click the `run_portfolio.bat` file
- A browser window should open automatically with the portfolio

**Mac/Linux:**
- Open terminal in the project directory
- Make the script executable: `chmod +x run_portfolio.sh`
- Run the script: `./run_portfolio.sh`
- A browser window should open automatically with the portfolio

#### Option 2: Manual method

1. Open a terminal/command prompt
2. Navigate to the project directory
3. Run the Python server script:
   ```
   python server.py
   ```
   Or directly use Python's built-in HTTP server:
   ```
   python -m http.server 8000
   ```
4. Open your browser and navigate to: `http://localhost:8000`

### Stopping the Server

- In the terminal window where the server is running, press `Ctrl+C`
- For Windows batch file users, close the command prompt window or press any key after stopping the server

## Customization

### Changing Personal Information

1. Edit the `index.html` file to update:
   - Your name and role
   - About section content
   - Project details
   - Contact information

2. Replace the code object in the About section with your own details:

```javascript
const developer = {
  name: 'Your Name',
  role: 'Your Role',
  loves: ['your', 'interests', 'here'],
  experience: X + ' years'
};
```

### Updating Projects

To add or modify projects, update the project cards in the projects section:

```html
<div class="project-card">
    <div class="project-icon">
        <i class="fas fa-your-icon"></i>
    </div>
    <div class="project-tags">
        <span class="tag">Technology 1</span>
        <span class="tag">Technology 2</span>
    </div>
    <h3>Project Name</h3>
    <p>Project description goes here.</p>
    <div class="project-links">
        <a href="#" class="btn">View Details <i class="fas fa-arrow-right"></i></a>
        <a href="#" class="btn-outline">Demo <i class="fas fa-external-link-alt"></i></a>
    </div>
</div>
```

### Changing Colors

The color scheme can be easily modified by updating the CSS variables in the `:root` section of `styles/main.css`:

```css
:root {
    --primary-color: #ff3e55;
    --secondary-color: #3e84ff;
    /* other variables */
}
```

## Deployment

This portfolio can be deployed to any static site hosting service, such as:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- Inspired by the Hydro portfolio design
- Icons from [Font Awesome](https://fontawesome.com)
- Fonts from Google Fonts 