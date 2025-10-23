import type { Cluster } from '../types';

const escapeHtml = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export const exportToHtml = (clusters: Cluster[], originalNotes: string[]): string => {
    let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Internal Flow Analysis</title>
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 20px auto; padding: 0 20px; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #3498db; }
                p { color: #555; font-style: italic; }
                ul { list-style-type: none; padding-left: 0; }
                li { background-color: #f9f9f9; border-left: 4px solid #3498db; margin-bottom: 8px; padding: 10px 15px; }
                .cluster { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            </style>
        </head>
        <body>
            <h1>Internal Flow Analysis Results</h1>
    `;

    clusters.forEach(cluster => {
        htmlContent += `
            <div class="cluster">
                <h2>${escapeHtml(cluster.title)}</h2>
                <p>${escapeHtml(cluster.description)}</p>
                <h3>Notes in this Cluster:</h3>
                <ul>
        `;
        cluster.note_numbers.forEach(noteNumber => {
            const noteText = originalNotes[noteNumber - 1] || 'Note not found';
            htmlContent += `<li>${escapeHtml(noteText)}</li>`;
        });
        htmlContent += `
                </ul>
            </div>
        `;
    });

    htmlContent += `
        </body>
        </html>
    `;
    return htmlContent;
};

const escapeCsvCell = (cellData: string): string => {
    let escaped = cellData.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
        escaped = `"${escaped}"`;
    }
    return escaped;
}

export const exportToCsv = (clusters: Cluster[], originalNotes: string[]): string => {
    const headers = ['Cluster Title', 'Cluster Description', 'Note Number', 'Note Text'];
    let csvContent = headers.join(',') + '\r\n';

    clusters.forEach(cluster => {
        const clusterTitle = escapeCsvCell(cluster.title);
        const clusterDesc = escapeCsvCell(cluster.description);

        cluster.note_numbers.forEach(noteNumber => {
            const noteText = originalNotes[noteNumber - 1] || 'Note not found';
            const row = [
                clusterTitle,
                clusterDesc,
                noteNumber,
                escapeCsvCell(noteText)
            ];
            csvContent += row.join(',') + '\r\n';
        });
    });

    return csvContent;
};