#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
import time
import random
from urllib.parse import urlparse

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        # Custom logging format
        print(f"\033[92m[INFO]\033[0m {self.address_string()} - {format % args}")
    
    def do_GET(self):
        # Simulate loading delay for better splash screen effect (only for HTML/CSS/JS files)
        path_lower = self.path.lower()
        if path_lower.endswith(('.html', '.css', '.js')) and path_lower != '/splash.css':
            # Small random delay to simulate loading
            time.sleep(random.uniform(0.05, 0.2))
            
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def run_server():
    handler = MyHttpRequestHandler
    
    # Create the server
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        server_url = f"http://localhost:{PORT}"
        
        print(f"\n\033[1m{'=' * 60}\033[0m")
        print(f"\033[1m DevStack Portfolio Server\033[0m")
        print(f"\033[1m{'=' * 60}\033[0m")
        print(f"\033[96m[SERVER]\033[0m Running at: \033[94m{server_url}\033[0m")
        print(f"\033[96m[SERVER]\033[0m Press Ctrl+C to stop the server")
        print(f"\033[1m{'-' * 60}\033[0m")
        
        # Open browser automatically
        try:
            webbrowser.open(server_url)
            print(f"\033[96m[BROWSER]\033[0m Opened portfolio in default browser")
        except Exception as e:
            print(f"\033[93m[WARNING]\033[0m Could not open browser automatically: {e}")
            print(f"\033[93m[WARNING]\033[0m Please manually navigate to: {server_url}")
        
        # Run server until interrupted
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n\033[96m[SERVER]\033[0m Shutting down...")
            print(f"\033[1m{'=' * 60}\033[0m")

if __name__ == "__main__":
    run_server() 