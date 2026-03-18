import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { createAuth } from '../app';

export function Settings() {

    const navigate = useNavigate();

    const [username, setUsername] = useState(localStorage.getItem("userName"));
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isChecked, setIsChecked] = useState(true); 

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        
        if (username.length < 3) {
            toast.error("Username should be at least 3 characters");
            return;
        }

        if (password != passwordConfirm) {
            toast.error("Passwords do not match");
            return;
        }
        
        if (password != "" && password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        if (username != localStorage.getItem("userName")) {
            const status = await createAuth("update/user", "PUT", JSON.stringify({ username }));

            if (status == 200) {
                localStorage.setItem('userName', username);
            } else if (status == 402) {
                toast.error("Invalid token or user not found. Log in again");
                return;
            } else if (status == 409) {
                toast.error("Username already taken");
                return;
            }
        }

        if (password != "") {
            const status = await createAuth("update/pass", "PUT", JSON.stringify({ password }));

            if (status == 402) {
                toast.error("Invalid token or user not found. Log in again");
                return;
            }
        }
        
        const status = await createAuth("update/share", "PUT", JSON.stringify({ isChecked }));
        localStorage.setItem("sharePublic", isChecked);

        if (status == 402) {
            toast.error("Invalid token or user not found. Log in again");
            return;
        }


        navigate('/library');
        toast.success("Settings updated");
        return;
    }

    const handleAccountDeletion = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/user", { method: "DELETE", });
        const status = res.status;

        if (status == 200) {
            localStorage.clear();
            navigate("/");
            toast.success("Account successfully deleted");
            return;
        } else if (status == 402) {
            toast.error("Invalid token or user not found. Log in again");
            return;
        }
    }
    
    return (
        <main>
            <h1 style={{ textAlign: "center" }}>Account Settings</h1>

            <form className="setting-form" onSubmit={ handleAccountUpdate }>

                <fieldset>
                    <legend><strong>Public Profile</strong></legend>
                    
                    <p>
                        <label>Username:</label><br/>
                        <input type="text" id="targetUsername" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </p>

{/*
                    <p>
                        <label>Profile Picture:</label><br/>
                        <input type="file" accept="image/png, image/jpeg"/>
                    </p>

                    <p>
                        <label>Bio:</label><br/>
                        <textarea rows="4" defaultValue={"Information on user..."}></textarea>
                    </p>
*/}
                </fieldset>
                
                <br/>

                <fieldset>
                    <legend><strong>Security</strong></legend>
                    
                    <p>
                        <label>New Password:</label><br/>
                        <input type="password" id="targetPassword" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </p>

                    <p>
                        <label >Confirm New Password:</label><br/>
                        <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}/>
                    </p>
                </fieldset>

                <br/>

                <fieldset>
                    <legend><strong>Library Preferences</strong></legend>
                    
                    <p><strong>Privacy:</strong></p>
                    
                    <input type="checkbox" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
                    <label htmlFor="show-activity">Share my activity in the public feed</label>
                    
                </fieldset>

                <br/>

                <fieldset className="delete-field">
                    <legend><strong>Danger Zone</strong></legend>
                    
                    <p>Once you delete your account, there is no going back.</p>
                    <button type="button" onClick={ handleAccountDeletion }>Delete Account</button>
                </fieldset>

                <br/>
                <hr/>
                <br/>

                <div className="update-settings">
                    <Link to="/library" >Cancel</Link>
                    <button type="submit">Save Changes</button>
                </div>

            </form>
        </main>
    
    );
}