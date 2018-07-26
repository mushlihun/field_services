import { Injectable } from '@angular/core';
import {SQLite} from 'ionic-native';

@Injectable()
export class Database {

    private storage: SQLite;
    private isOpen: boolean;

    public constructor() {
        if(!this.isOpen) {
            this.storage = new SQLite();
            this.storage.openDatabase({name: "data.db", location: "default"}).then(() => {
                this.storage.executeSql("CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, username TEXT, password TEXT, salt TEXT, iv TEXT)", []);
                this.storage.executeSql("CREATE TABLE IF NOT EXISTS master (id INTEGER PRIMARY KEY AUTOINCREMENT, password TEXT)", []);
                this.isOpen = true;
            });
        }
    }

    public getPasswords() {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("SELECT * FROM passwords ORDER BY title", []).then((data) => {
                let passwords = [];
                if(data.rows.length > 0) {
                    for(let i = 0; i < data.rows.length; i++) {
                        passwords.push({
                            id: data.rows.item(i).id,
                            title: data.rows.item(i).title,
                            username: data.rows.item(i).username,
                            password: data.rows.item(i).password,
                            salt: data.rows.item(i).salt,
                            iv: data.rows.item(i).iv
                        });
                    }
                }
                resolve(passwords);
            }, (error) => {
                reject(error);
            });
        });
    }

    public getPasswordById(passwordId: number) {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("SELECT * FROM passwords WHERE id = ?", [passwordId]).then((data) => {
                let password = {};
                if(data.rows.length > 0) {
                    password = {
                        id: data.rows.item(0).id,
                        title: data.rows.item(0).title,
                        username: data.rows.item(0).username,
                        password: data.rows.item(0).password,
                        salt: data.rows.item(0).salt,
                        iv: data.rows.item(0).iv
                    };
                }
                resolve(password);
            }, (error) => {
                reject(error);
            });
        });
    }

    public createPassword(item: any) {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("INSERT INTO passwords (title, username, password, salt, iv) VALUES (?, ?, ?, ?, ?)", [item.title, item.username, item.password, item.salt, item.iv]).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    public deletePasswords() {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("DELETE FROM passwords", []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    public getMaster() {
        return new Promise((resolve, reject) => {
            this.storage.executeSql('SELECT * FROM master LIMIT 1', []).then((data) => {
                let master = {};
                if(data.rows.length > 0) {
                    for(let i = 0; i < data.rows.length; i++) {
                        master = {
                            id: data.rows.item(i).id,
                            password: data.rows.item(i).password
                        };
                    }
                }
                resolve(master);
            }, (error) => {
                reject(error);
            });
        });
    }

    public createMaster(item: any) {
        return new Promise((resolve, reject) => {
            this.storage.executeSql('INSERT INTO master (password) VALUES (?)', [item.password]).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

    public deleteMaster() {
        return new Promise((resolve, reject) => {
            this.storage.executeSql('DELETE FROM master', []).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    }

// tslint:disable-next-line:eofline
}