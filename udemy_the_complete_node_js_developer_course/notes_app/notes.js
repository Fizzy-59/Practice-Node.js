const fs = require('fs')
const chalk = require('chalk')


const getNotes = () => "Your notes ..."

const addNote = (title, body) =>
{
    const notes = loadNotes()

    const duplicateNotes = notes.filter((note) => note.title === title)

   if (duplicateNotes.length === 0)
   {
       notes.push({
           title: title,
           body: body
       })

       saveNotes(notes)
       console.log(chalk.green.inverse('New note added'))
   }
   else {
       console.log(chalk.yellow.inverse('!!! Note title taken !!!'))
   }

}

const removeNote = (title) =>
{
    const notes = loadNotes()

    const notesToKeep = notes.filter((note) => note.title !== title )

    if (notesToKeep.length === notes.length)
    {
        console.log(chalk.red.inverse('Note doesnt exist'))
    }
    else
    {
        saveNotes(notesToKeep)
        console.log(chalk.yellow.inverse('Note removed'))
    }

}

// Charge le contenu JSON et l'intéprête
const loadNotes = () =>
{
    try
    {
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()

        return JSON.parse(dataJSON)

    } catch (e)
    {
        return []
    }
    
}

const saveNotes = (notes) =>
{
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}


module.exports =
{
    getNotes: getNotes,
    addNote: addNote,
    removeNote: removeNote
}