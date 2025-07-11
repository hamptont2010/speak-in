import tkinter as tk
from tkinter import messagebox
import json
import os

def save_to_json():
    chamber = chamber_var.get()
    district = entry_district.get().strip()
    name = entry_name.get().strip()
    phone = entry_phone.get().strip()
    email = entry_email.get().strip()
    party = entry_party.get().strip()
    residence = entry_residence.get().strip()

    if not district:
        messagebox.showerror("Error", "District number is required.")
        return

    # Format the data for one chamber
    data = {
        district: {
            "name": name,
            "phone": phone,
            "email": email,
            "party": party,
            "residence": residence
        }
    }

    file_path = "districts.json"

    # Load existing file or initialize
    if os.path.exists(file_path):
        with open(file_path, "r") as file:
            try:
                existing_data = json.load(file)
            except json.JSONDecodeError:
                existing_data = {"house": {}, "senate": {}}
    else:
        existing_data = {"house": {}, "senate": {}}

    # Ensure both chambers exist in the data
    if "house" not in existing_data:
        existing_data["house"] = {}
    if "senate" not in existing_data:
        existing_data["senate"] = {}

    # Now safely update the correct one
    existing_data[chamber].update(data)


    # Write back to file
    with open(file_path, "w") as file:
        json.dump(existing_data, file, indent=4)

    messagebox.showinfo("Success", f"{chamber.title()} District {district} saved.")
    for entry in entries:
        entry.delete(0, tk.END)

# GUI setup
root = tk.Tk()
root.title("Districts JSON Creator")

# Chamber selector
chamber_var = tk.StringVar(value="house")
tk.Label(root, text="Chamber:").grid(row=0, column=0, sticky=tk.W, padx=10, pady=5)
tk.OptionMenu(root, chamber_var, "house", "senate").grid(row=0, column=1, padx=10, pady=5)

# Entry fields
labels = ["District Number", "Name", "Phone", "Email", "Party", "Residence"]
entries = []

for i, label in enumerate(labels, start=1):
    tk.Label(root, text=label).grid(row=i, column=0, sticky=tk.W, padx=10, pady=5)
    entry = tk.Entry(root, width=40)
    entry.grid(row=i, column=1, padx=10, pady=5)
    entries.append(entry)

entry_district, entry_name, entry_phone, entry_email, entry_party, entry_residence = entries

# Save button
tk.Button(root, text="Save to JSON", command=save_to_json).grid(row=len(labels)+1, column=0, columnspan=2, pady=10)

root.mainloop()
