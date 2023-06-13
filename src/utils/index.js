const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
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
            opa : opa,
            IsImage : false,
            IsFile : false,
            full : ''
        }
    }

    const IsImage = !!baileysMessage.message?.imageMessage ||
            !!baileysMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage

    const isFile = !!baileysMessage.message?.documentMessage        

    const [command, ...args] = fullMessage.trim().split(' ')   
    const arg = args.reduce((acc, arg) => acc + ' ' + arg, '').trim();

    return {
        remoteJid : baileysMessage?.key?.remoteJid,
        fullMessage,
        quotedMsg : opa,
        opa : opa,
        command : command.replace(PREFIX, '').trim(),
        args : arg.trim(),
        key : baileysMessage?.key?.id,
        full : textMessage,
        IsImage,
        isFile
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
    const content = baileysMessage.message?.documentMessage;
    console.log(content);
    if(!content){
        return null;
    }

    const stream = await downloadContentFromMessage(content, 'document')
   
    const filePath = path.resolve(TEMP_FOLDER, filename)
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    return filePath

   
}

module.exports = {
    DownloadImage,
    ExtractDataFromMessage,
    DownloadDoc,
    isCommand
}