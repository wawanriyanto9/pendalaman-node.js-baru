import sqlite from 'sqlite3'

//init database cek error koneksi ke DB

export function InitDatabase() {
    return new sqlite.Database('data', (err) => {
        if (err) {
            throw err
        }
        console.log('OMG!!, Init database success!!')
    })
}

/**
 * init table
 * @param {sqlite.Database} db
 */
export function initTable(db) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS member (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            photo TEXT NOT NULL,
            name VARCHAR(60) NOT NULL,
            age INTEGER NOT NULL
        );`)
    })
}
/**
 * 
 * @param {sqlite.Database} db
 * @param [string] name
 * @param [number] age
 * @param [string] photo
 */

export function insertmember(db, name, age, photo) {
    db.run('INSERT INTO member(photo,name,age) VALUES ($photo,$name,$age)', { $photo: photo, $name: name, $age: age }, (err) => {
        if (err) {
            throw err
        }
        console.log('add member success')
    })
}
export function getmember(db) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM member', (err, result) => {
            if (err) {
                reject(err)
            }

            console.log('Query result', result)
            resolve(result)
        })
    })

}