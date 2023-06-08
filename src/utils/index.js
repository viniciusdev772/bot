const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const {PREFIX,TEMP_FOLDER} = require('../config')
const path = require('path')
const fs = require('fs')
const { writeFile } = require('fs/promises')
function ExtractDataFromMessage(baileysMessage){
    const textMessage  = baileysMessage.message?.conversation;
    const extendedTextMessage  = baileysMessage.message?.extendedTextMessage?.text
    const opa  = baileysMessage.message?.extendedTextMessage?.contextInfo?.participant
    const imageTextMessage =  baileysMessage.message?.imageMessage?.caption

    const fullMessage = textMessage || extendedTextMessage || imageTextMessage

    if(!fullMessage){
        return {
            remoteJid : '',
            fullMessage : '',
            quotedMsg : '',
            command : '',
            args : '',
            id : '',
            IsImage : false,
            full : ''
        }
    }

    const IsImage = !!baileysMessage.message?.imageMessage ||
            !!baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    const [command, ...args] = fullMessage.trim().split(' ')   
    const arg = args.reduce((acc, arg) => acc + ' ' + arg, '').trim();

    return {
        remoteJid : baileysMessage?.key?.remoteJid,
        fullMessage,
        quotedMsg : opa,
        command : command.replace(PREFIX, '').trim(),
        args : arg.trim(),
        key : baileysMessage?.key?.id,
        full : textMessage,
        IsImage
    }

}

function isCommand(baileysMessage){
    const {fullMessage}  = ExtractDataFromMessage(baileysMessage)
    return fullMessage && fullMessage.startsWith(PREFIX)
}

async function DownloadImage (baileysMessage, filename){
    const content = baileysMessage.message?.imageMessage ||
    baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    if(!content){
        return null;
    }
    const stream = await downloadContentFromMessage(content, 'image')
    let buffer = Buffer.from([])

    for await (const chunk of stream){
        buffer =  Buffer.concat([buffer,chunk])
    }
    const filePath = path.resolve(TEMP_FOLDER, `${filename}.png`)

    await writeFile(filePath,buffer)
    return filePath
}

async function DownloadDoc (baileysMessage, filename){
    const content = baileysMessage.message?.imageMessage ||
    baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    if(!content){
        return null;
    }
    const stream = await downloadContentFromMessage(content, 'document')
    let buffer = Buffer.from([])

    for await (const chunk of stream){
        buffer =  Buffer.concat([buffer,chunk])
    }
    const filePath = path.resolve(TEMP_FOLDER, `${filename}.png`)

    await writeFile(filePath,buffer)
    return filePath
}

module.exports = {
    DownloadImage,
    ExtractDataFromMessage,
    isCommand
}