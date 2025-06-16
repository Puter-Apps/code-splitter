// Global variables
        let generatedFiles = {
            html: '',
            css: '',
            js: ''
        };

        // Load example code into the input textarea
        function loadExample() {
            const exampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .btn {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
        }
        
        .btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }
        
        #output {
            margin-top: 20px;
            padding: 15px;
            background: #f0f0f0;
            border-radius: 5px;
            min-height: 100px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to My App</h1>
        <button class="btn" onclick="showMessage()">Click Me!</button>
        <button class="btn" onclick="changeColor()">Change Color</button>
        <button class="btn" onclick="addItem()">Add Item</button>
        <div id="output">
            <p>Click the buttons above to see some action!</p>
        </div>
    </div>

    <script>
        let itemCount = 0;
        
        function showMessage() {
            const output = document.getElementById('output');
            output.innerHTML = '<h3>Hello from JavaScript!</h3><p>This message was generated dynamically.</p>';
        }
        
        function changeColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.querySelector('.container').style.background = randomColor;
            
            const output = document.getElementById('output');
            output.innerHTML = \`<p>Background color changed to: <strong>\${randomColor}</strong></p>\`;
        }
        
        function addItem() {
            itemCount++;
            const output = document.getElementById('output');
            output.innerHTML += \`<div style="margin: 5px 0; padding: 5px; background: #e0e0e0; border-radius: 3px;">Item #\${itemCount}</div>\`;
        }
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            console.log('App initialized successfully!');
        });
    <\/script>
</body>
</html>`;

            document.getElementById('codeInput').value = exampleCode;
            showStatus('Example code loaded! Click "Break Code Apart" to separate it.', 'info');
        }

        // Extract CSS content from style tags
        function extractCSS(html) {
            const styles = [];
            const styleRegex = /<style[^>]*?>([\s\S]*?)<\/style>/gi;
            let match;
            
            while ((match = styleRegex.exec(html)) !== null) {
                const cssContent = match[1].trim();
                if (cssContent) {
                    styles.push(cssContent);
                }
            }
            
            return styles;
        }

        // Extract JavaScript content from script tags
        function extractJS(html) {
            const scripts = [];
            const scriptRegex = /<script(?![^>]*\bsrc\s*=)[^>]*?>([\s\S]*?)<\/script>/gi;
            let match;
            
            while ((match = scriptRegex.exec(html)) !== null) {
                const jsContent = match[1].trim();
                if (jsContent) {
                    scripts.push(jsContent);
                }
            }
            
            return scripts;
        }

        // Remove CSS and JS from HTML
        function cleanHTML(html) {
            // Remove style tags and their content
            html = html.replace(/<style[^>]*?>[\s\S]*?<\/style>/gi, '');
            
            // Remove inline script tags (but keep external scripts with src attribute)
            html = html.replace(/<script(?![^>]*\bsrc\s*=)[^>]*?>[\s\S]*?<\/script>/gi, '');
            
            // Clean up extra whitespace and empty lines
            html = html.replace(/\n\s*\n/g, '\n');
            
            return html.trim();
        }

        // Main function to break apart the code
        function breakCode() {
            const input = document.getElementById('codeInput').value.trim();
            
            if (!input) {
                showStatus('Please paste some code first!', 'error');
                return;
            }

            try {
                showStatus('Processing code...', 'info');
                
                // Extract CSS and JavaScript
                const styles = extractCSS(input);
                const scripts = extractJS(input);
                
                // Clean HTML by removing style and script tags
                let cleanedHTML = cleanHTML(input);
                
                // Generate the separated files
                generateFiles(cleanedHTML, styles, scripts);
                
                showStatus('Code successfully broken apart! Files are ready.', 'success');
                document.getElementById('saveFilesBtn').disabled = false;
                document.getElementById('downloadFilesBtn').disabled = false;
                
            } catch (error) {
                showStatus('Error processing code: ' + error.message, 'error');
                console.error('Error:', error);
            }
        }

        // Generate the three separate files
        function generateFiles(htmlContent, styles, scripts) {
            try {
                // Parse the HTML to get proper structure
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                
                // Extract existing head content (excluding style/script tags)
                let existingHeadContent = '';
                const headElement = doc.head;
                if (headElement) {
                    const headChildren = Array.from(headElement.children);
                    const filteredHead = headChildren.filter(child => 
                        child.tagName.toLowerCase() !== 'style' && 
                        child.tagName.toLowerCase() !== 'script'
                    );
                    existingHeadContent = filteredHead.map(el => '    ' + el.outerHTML).join('\n');
                }
                
                // Extract body content
                let bodyContent = '';
                const bodyElement = doc.body;
                if (bodyElement) {
                    bodyContent = bodyElement.innerHTML;
                } else {
                    bodyContent = htmlContent.replace(/<\/?html[^>]*>/gi, '')
                                           .replace(/<head[\s\S]*?<\/head>/gi, '')
                                           .replace(/<\/?body[^>]*>/gi, '')
                                           .trim();
                }
                
                // Build the HTML file
                let htmlFile = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
                htmlFile += '    <meta charset="UTF-8">\n';
                htmlFile += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
                
                // Check if title exists in existing head content
                if (!existingHeadContent.toLowerCase().includes('<title>')) {
                    htmlFile += '    <title>My App</title>\n';
                }
                
                // Add CSS link if there are styles
                if (styles.length > 0) {
                    htmlFile += '    <link rel="stylesheet" href="style.css">\n';
                }
                
                // Add existing head content
                if (existingHeadContent) {
                    htmlFile += existingHeadContent + '\n';
                }
                
                htmlFile += '</head>\n<body>\n';
                
                // Add body content with basic indentation
                if (bodyContent.trim()) {
                    const lines = bodyContent.split('\n');
                    for (let line of lines) {
                        const trimmed = line.trim();
                        if (trimmed) {
                            htmlFile += '    ' + trimmed + '\n';
                        }
                    }
                }
                
                // Add JS script tag if there are scripts
                if (scripts.length > 0) {
                    htmlFile += '    <script src="app.js"><\/script>\n';
                }
                
                htmlFile += '</body>\n</html>';
                
                generatedFiles.html = htmlFile;
                
                // Generate CSS file
                if (styles.length > 0) {
                    generatedFiles.css = styles.join('\n\n/* ===== Next Style Block ===== */\n\n');
                } else {
                    generatedFiles.css = `/* Styles for your app */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}`;
                }
                
                // Generate JS file
                if (scripts.length > 0) {
                    generatedFiles.js = scripts.join('\n\n// ===== Next Script Block =====\n\n');
                } else {
                    generatedFiles.js = `// JavaScript for your app\nconsole.log('App loaded successfully!');`;
                }
                
                // Display the files
                document.getElementById('htmlOutput').textContent = generatedFiles.html;
                document.getElementById('cssOutput').textContent = generatedFiles.css;
                document.getElementById('jsOutput').textContent = generatedFiles.js;
                
                document.getElementById('outputSection').classList.remove('hidden');
                
            } catch (error) {
                throw new Error('File generation failed: ' + error.message);
            }
        }

        // Save files to Puter cloud storage with folder selection
        async function saveFiles() {
            if (!generatedFiles.html) {
                showStatus('Please break the code apart first!', 'error');
                return;
            }

            try {
                /*
                 * PUTER.JS TUTORIAL: Authentication API
                 * 
                 * puter.auth.isSignedIn() - Checks if the user is currently authenticated with Puter
                 * - Returns: boolean (true if signed in, false otherwise)
                 * - Use this before accessing user-specific resources like cloud storage
                 * 
                 * puter.auth.signIn() - Opens a secure authentication dialog for the user
                 * - Returns: Promise that resolves when authentication is complete
                 * - This is non-blocking and handles the entire auth flow (login/register)
                 * - No need to manage tokens or cookies - Puter.js handles this automatically
                 */
                if (!puter.auth.isSignedIn()) {
                    showStatus('Authentication required. Please sign in to save files.', 'info');
                    await puter.auth.signIn();
                }

                showStatus('<div class="loading"><div class="spinner"></div>Please select a folder to save your files...</div>', 'info');
                
                /*
                 * PUTER.JS TUTORIAL: UI Components API
                 * 
                 * puter.ui.showDirectoryPicker() - Opens a familiar file explorer interface
                 * - Returns: Promise that resolves with the selected directory object
                 * - The directory object contains properties like:
                 *   - path: The full path to the selected directory
                 *   - name: The name of the directory
                 *   - id: Unique identifier for the directory
                 * - This provides a native-feeling UX for folder selection
                 * - Automatically handles permissions and access rights
                 */
                const selectedFolder = await puter.ui.showDirectoryPicker();
                
                showStatus('<div class="loading"><div class="spinner"></div>Saving files to selected folder...</div>', 'info');
                
                // Save files directly in the selected folder (not in a subdirectory)
                const folderPath = selectedFolder.path;
                
                /*
                 * PUTER.JS TUTORIAL: File System API
                 * 
                 * puter.fs.write(path, content) - Writes content to a file at the specified path
                 * - Parameters:
                 *   - path: String - Full path including filename where content should be saved
                 *   - content: String/Blob/ArrayBuffer - The content to write to the file
                 * - Returns: Promise that resolves when the write operation completes
                 * - Automatically creates the file if it doesn't exist
                 * - Overwrites the file if it already exists
                 * - Handles all the necessary permissions and access controls
                 * - Works with text content (as shown here) or binary data
                 */
                await puter.fs.write(`${folderPath}/index.html`, generatedFiles.html);
                
                // Write CSS file using the same fs.write method
                await puter.fs.write(`${folderPath}/style.css`, generatedFiles.css);
                
                // Write JavaScript file using the same fs.write method
                await puter.fs.write(`${folderPath}/app.js`, generatedFiles.js);
                
                showStatus(`<i class="fas fa-check-circle" style="color: #155724;"></i> Files saved successfully to: "${folderPath}"`, 'success');
                
            } catch (error) {
                if (error.message.includes('canceled') || error.message.includes('cancelled')) {
                    showStatus('File save cancelled by user.', 'info');
                } else {
                    showStatus('Error saving files: ' + error.message, 'error');
                    console.error('Error saving files:', error);
                }
            }
        }

        // Download files as ZIP to user's PC
        async function downloadFiles() {
            if (!generatedFiles.html) {
                showStatus('Please break the code apart first!', 'error');
                return;
            }

            try {
                showStatus('<div class="loading"><div class="spinner"></div>Preparing download...</div>', 'info');
                
                // Create a proper ZIP file
                const zipBlob = await createZipFile();
                
                // Create download link and trigger download
                const url = URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'code-breaker-files.zip';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                showStatus('<i class="fas fa-check-circle" style="color: #155724;"></i> Files downloaded successfully as code-breaker-files.zip', 'success');
                
            } catch (error) {
                showStatus('Error downloading files: ' + error.message, 'error');
                console.error('Error downloading files:', error);
            }
        }

        // Create ZIP file using proper ZIP format
        async function createZipFile() {
            const files = [
                { name: 'index.html', content: generatedFiles.html },
                { name: 'style.css', content: generatedFiles.css },
                { name: 'app.js', content: generatedFiles.js }
            ];
            
            // Create ZIP using compression streams if available, otherwise fallback
            if (typeof CompressionStream !== 'undefined') {
                return await createZipWithCompression(files);
            } else {
                return await createZipFallback(files);
            }
        }

        // Create ZIP with compression streams (modern browsers)
        async function createZipWithCompression(files) {
            const zipParts = [];
            const centralDir = [];
            let offset = 0;

            for (const file of files) {
                const content = new TextEncoder().encode(file.content);
                const fileName = new TextEncoder().encode(file.name);
                
                // Local file header
                const localHeader = new Uint8Array(30 + fileName.length);
                const view = new DataView(localHeader.buffer);
                
                // Local file header signature
                view.setUint32(0, 0x04034b50, true);
                view.setUint16(4, 20, true); // Version needed
                view.setUint16(6, 0, true);  // General purpose bit flag
                view.setUint16(8, 0, true);  // Compression method (stored)
                view.setUint16(10, 0, true); // File last modification time
                view.setUint16(12, 0, true); // File last modification date
                view.setUint32(14, crc32(content), true); // CRC-32
                view.setUint32(18, content.length, true); // Compressed size
                view.setUint32(22, content.length, true); // Uncompressed size
                view.setUint16(26, fileName.length, true); // File name length
                view.setUint16(28, 0, true); // Extra field length
                
                // File name
                localHeader.set(fileName, 30);
                
                zipParts.push(localHeader, content);
                
                // Central directory entry
                const centralEntry = {
                    fileName: fileName,
                    offset: offset,
                    size: content.length,
                    crc: crc32(content)
                };
                centralDir.push(centralEntry);
                
                offset += localHeader.length + content.length;
            }

            // Central directory
            const centralDirStart = offset;
            const centralDirParts = [];
            
            for (const entry of centralDir) {
                const centralHeader = new Uint8Array(46 + entry.fileName.length);
                const view = new DataView(centralHeader.buffer);
                
                view.setUint32(0, 0x02014b50, true); // Central directory signature
                view.setUint16(4, 20, true);   // Version made by
                view.setUint16(6, 20, true);   // Version needed
                view.setUint16(8, 0, true);    // General purpose bit flag
                view.setUint16(10, 0, true);   // Compression method
                view.setUint16(12, 0, true);   // File last modification time
                view.setUint16(14, 0, true);   // File last modification date
                view.setUint32(16, entry.crc, true); // CRC-32
                view.setUint32(20, entry.size, true); // Compressed size
                view.setUint32(24, entry.size, true); // Uncompressed size
                view.setUint16(28, entry.fileName.length, true); // File name length
                view.setUint16(30, 0, true);   // Extra field length
                view.setUint16(32, 0, true);   // File comment length
                view.setUint16(34, 0, true);   // Disk number start
                view.setUint16(36, 0, true);   // Internal file attributes
                view.setUint32(38, 0, true);   // External file attributes
                view.setUint32(42, entry.offset, true); // Relative offset
                
                centralHeader.set(entry.fileName, 46);
                centralDirParts.push(centralHeader);
            }
            
            const centralDirSize = centralDirParts.reduce((sum, part) => sum + part.length, 0);
            
            // End of central directory
            const endOfCentralDir = new Uint8Array(22);
            const endView = new DataView(endOfCentralDir.buffer);
            
            endView.setUint32(0, 0x06054b50, true); // End of central dir signature
            endView.setUint16(4, 0, true);    // Number of this disk
            endView.setUint16(6, 0, true);    // Disk where central directory starts
            endView.setUint16(8, files.length, true); // Number of central directory records on this disk
            endView.setUint16(10, files.length, true); // Total number of central directory records
            endView.setUint32(12, centralDirSize, true); // Size of central directory
            endView.setUint32(16, centralDirStart, true); // Offset of start of central directory
            endView.setUint16(20, 0, true);   // ZIP file comment length
            
            // Combine all parts
            const allParts = [...zipParts, ...centralDirParts, endOfCentralDir];
            return new Blob(allParts, { type: 'application/zip' });
        }

        // Fallback ZIP creation for older browsers
        async function createZipFallback(files) {
            // Create a simple archive format that can be extracted
            let archiveContent = '<!-- CODE BREAKER ARCHIVE -->\n';
            archiveContent += '<!-- Extract files by copying content between markers -->\n\n';
            
            files.forEach(file => {
                archiveContent += `<!-- FILE: ${file.name} -->\n`;
                archiveContent += `<!-- CONTENT START -->\n`;
                archiveContent += file.content;
                archiveContent += `\n<!-- CONTENT END -->\n\n`;
            });
            
            archiveContent += '<!-- Instructions:\n';
            archiveContent += '1. Copy content between CONTENT START/END markers\n';
            archiveContent += '2. Save each section as the filename specified in FILE comment\n';
            archiveContent += '3. Make sure to preserve exact formatting and spacing\n';
            archiveContent += '-->\n';
            
            return new Blob([archiveContent], { type: 'text/plain' });
        }

        // Simple CRC32 implementation for ZIP files
        function crc32(data) {
            let crc = 0xFFFFFFFF;
            const table = [];
            
            // Generate CRC table
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let j = 0; j < 8; j++) {
                    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                }
                table[i] = c;
            }
            
            // Calculate CRC
            for (let i = 0; i < data.length; i++) {
                crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
            }
            
            return (crc ^ 0xFFFFFFFF) >>> 0;
        }

        // Copy content to clipboard
        function copyToClipboard(targetId) {
            const element = document.getElementById(targetId);
            if (!element) {
                showStatus('Error: Could not find content to copy', 'error');
                return;
            }
            
            const text = element.textContent;
            
            if (!navigator.clipboard) {
                // Fallback for browsers without clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showCopyFeedback(event.target);
                } catch (err) {
                    showStatus('Failed to copy to clipboard', 'error');
                }
                document.body.removeChild(textArea);
                return;
            }
            
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(event.target);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showStatus('Failed to copy to clipboard', 'error');
            });
        }

        // Show visual feedback for copy action
        function showCopyFeedback(button) {
            const originalText = button.textContent;
            const originalBg = button.style.background;
            
            button.textContent = 'Copied!';
            button.style.background = 'rgba(76, 175, 80, 0.3)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalBg;
            }, 1500);
        }

        // Show status message
        function showStatus(message, type) {
            const statusDiv = document.getElementById('statusDiv');
            statusDiv.className = `status ${type}`;
            statusDiv.innerHTML = message;
            statusDiv.classList.remove('hidden');
            
            // Auto-hide after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    statusDiv.classList.add('hidden');
                }, 5000);
            }
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Main action buttons
            document.getElementById('breakCodeBtn').addEventListener('click', breakCode);
            document.getElementById('saveFilesBtn').addEventListener('click', saveFiles);
            document.getElementById('downloadFilesBtn').addEventListener('click', downloadFiles);
            document.getElementById('loadExampleBtn').addEventListener('click', loadExample);
            
            // Copy buttons with event delegation
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('copy-btn')) {
                    const targetId = e.target.getAttribute('data-target');
                    if (targetId) {
                        copyToClipboard(targetId);
                    }
                }
            });
            
            // Textarea improvements
            const codeInput = document.getElementById('codeInput');
            
            // Allow Tab key for better code editing
            codeInput.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = this.selectionStart;
                    const end = this.selectionEnd;
                    this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 4;
                }
            });
            
            console.log('HTML5 Code Breaker initialized successfully!');
        });