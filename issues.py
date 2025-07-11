import tkinter as tk
from tkinter import messagebox
import json
import os

def save_issue():
    issue_id = entry_id.get().strip()
    title = entry_title.get().strip()
    summary = entry_summary.get().strip()
    talking_points = text_points.get("1.0", tk.END).strip().split('\n')
    script = text_script.get("1.0", tk.END).strip()

    if not issue_id or not title or not summary or not script:
        messagebox.showerror("Missing Info", "All fields except talking points are required.")
        return

    new_issue = {
        "id": issue_id,
        "title": title,
        "summary": summary,
        "talkingPoints": [pt for pt in talking_points if pt],
        "script": script
    }

    file_path = "issues.json"

    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                issues = json.load(f)
            except json.JSONDecodeError:
                issues = []
    else:
        issues = []

    # Check if issue already exists (update if so)
    for i, issue in enumerate(issues):
        if issue["id"] == issue_id:
            issues[i] = new_issue
            break
    else:
        issues.append(new_issue)

    with open(file_path, "w") as f:
        json.dump(issues, f, indent=4)

    messagebox.showinfo("Success", f"Issue '{title}' saved to issues.json!")
    entry_id.delete(0, tk.END)
    entry_title.delete(0, tk.END)
    entry_summary.delete(0, tk.END)
    text_points.delete("1.0", tk.END)
    text_script.delete("1.0", tk.END)

# GUI
root = tk.Tk()
root.title("Issue JSON Editor")

tk.Label(root, text="Issue ID (e.g., 'voter-id')").pack(anchor='w')
entry_id = tk.Entry(root, width=50)
entry_id.pack()

tk.Label(root, text="Title").pack(anchor='w')
entry_title = tk.Entry(root, width=50)
entry_title.pack()

tk.Label(root, text="Summary").pack(anchor='w')
entry_summary = tk.Entry(root, width=50)
entry_summary.pack()

tk.Label(root, text="Talking Points (one per line)").pack(anchor='w')
text_points = tk.Text(root, height=6, width=50)
text_points.pack()

tk.Label(root, text="Full Script").pack(anchor='w')
text_script = tk.Text(root, height=8, width=50)
text_script.pack()

tk.Button(root, text="Save Issue", command=save_issue).pack(pady=10)

root.mainloop()
