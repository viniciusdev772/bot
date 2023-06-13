const {
  isCommand,
  ExtractDataFromMessage,
  DownloadImage,
  DownloadDoc,
} = require("./utils/index");
const { BOT_EMOJI, TEMP_FOLDER } = require("./config");
const path = require("path");
const fs = require("fs");

const crypto = require('crypto');
const axios = require('axios');

let numero7 = "" ;

async function shortenUrl(longUrl) {
  try {
    const response = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
    if (response.data && response.data.shorturl) {
      return response.data.shorturl;
    }
  } catch (error) {
    console.error('Erro ao encurtar o URL:', error.message);
  }
}

async function consultar(celular, tamanho) {
  const url = `https://viniciusdev.online/whatsapp_bot/consultar.php?celular=${celular}&tamanho=${tamanho}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar:', error.message);
    throw error;
  }
}


function removerDominioWhatsapp(numero) {
  const posicaoArroba = numero.indexOf("@");
  if (posicaoArroba !== -1) {
    return numero.substring(0, posicaoArroba);
  }
  return numero;
}



// Exemplo de uso:


async function enviarCelular(celular) {
  const url = `https://viniciusdev.online/whatsapp_bot/create.php?celular=${celular}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar o número de celular:', error.message);
    throw error;
  }
}

async function enviarArquivo(celular, tamanho, arquivo) {
  const url = `https://viniciusdev.online/whatsapp_bot/cad.php?celular=${celular}&tamanho=${tamanho}&arquivo=${arquivo}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error.message);
    throw error;
  }
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(length);
  const result = [];

  for (let i = 0; i < randomBytes.length; i++) {
    const index = randomBytes[i] % characters.length;
    result.push(characters[index]);
  }

  return result.join('');
}

const { exec } = require("child_process");
async function middlewares(bot) {
  bot.ev.on("messages.upsert", async ({ messages }) => {
    const baileysMessage = messages[0];
    const m = messages[0]
    const message = messages[0];
    const messageType = Object.keys (m.message)[0]
    console.log('Arquivo Recebido ',messageType)


    if (message.key.remoteJid.endsWith('@g.us')) {
      // Verifica se a mensagem é de um grupo  
        const number = baileysMessage.message?.extendedTextMessage?.contextInfo?.participant;
        numero7 = baileysMessage.message?.extendedTextMessage?.contextInfo?.participant;
        console.log('Número de celular:', number);
        console.log('numero da conversa em grupo', numero7);
      console.log('Mensagem de um grupo');
    } else {
      // Se não for um grupo, é uma conversa privada
      numero7 =  message.key.remoteJid.replace('@s.whatsapp.net', '');
      console.log('Número de celular:', message.key.remoteJid.replace('@s.whatsapp.net', ''));
      console.log('Mensagem de uma conversa privada');
      console.log('numero da conversa privada', numero7);
    }



    console.log('numero da conversa', numero7);
    
    const content23 = baileysMessage.message?.documentMessage;
    console.log('Arquivo Recebido ',baileysMessage.message)
        if(content23){
        const numero = numero7;  
        nome_do_arquivo = content23.fileName
        peso_do_arquivo = content23.fileLength
        const lowValue = peso_do_arquivo;
        console.log(lowValue);
        enviarCelular(numero)
            .then(resposta => {
              bot.sendMessage(
                messages[0].key.remoteJid,
                { text: resposta },
                { quoted: messages[0] }
              );
              console.log(numero);
            })
            .catch(error => {
              console.error(error);
        });

        consultar(numero, peso_do_arquivo)
        .then(resposta => {
          const { sucesso, mensagem,url } = resposta;
          console.log('Sucesso:', sucesso);
          console.log('Mensagem:', mensagem);

          if(!sucesso){
            bot.sendMessage(
              messages[0].key.remoteJid,
              { text: mensagem },
              { quoted: messages[0] }
            );
          }else{
            const randomString = generateRandomString(10);
        const nomeDoArquivoComString = randomString + '_' + nome_do_arquivo;  
        const inpuPath =  DownloadDoc(baileysMessage, nomeDoArquivoComString);
        const outputPath = path.resolve(TEMP_FOLDER, nomeDoArquivoComString);
        console.log('inpuPath', inpuPath);
        console.log('outputPath', outputPath);

        console.log('url direto do arquivo', 'https://viniciusdev.online/bot/assets/temp/' + nomeDoArquivoComString);

        //const url = 'https://viniciusdev.online/bot/assets/temp/' + nomeDoArquivoComString;

      enviarArquivo(numero, peso_do_arquivo, nomeDoArquivoComString)
      .then(resposta => {
        console.log(resposta);
        const { sucesso, mensagem,url } = resposta;
        const url1 =  url;
        bot.sendMessage(
          messages[0].key.remoteJid,
          { text: "Seu Arquivo foi Processado, baixe ele aqui no link encurtado " + encodeURI(url1) + " compartilhe o bot https://wa.me/+5555992133798 " },
          { quoted: messages[0] }
        );
      })
      .catch(error => {
        console.error(error);
      });

         }

        })
        .catch(error => {
          console.error(error);
        });

        

        

        }

    const content = baileysMessage.message?.mediaMessage;
    const content2 = baileysMessage.message?.documentMessage;
   
    if(content2){
      const nome_do_arquivo = content2.fileName
      const get =  Object.keys (content2)
      console.log('Arquivo Recebido ',get)
      console.log('A mensagem recebida é um arquivo!');
      console.log('Nome do arquivo:', content2.fileName);
      console.log('Tamanho do arquivo:', content2.fileLength);
      console.log('URl do arquivo:', content2.url);
      console.log('MIME Type:', content2.mimetype);
    }
      

    if (!baileysMessage?.message || !isCommand(baileysMessage)) {
      return;
    }
    

    switch (command.toLowerCase()) {
      case "ping":
        console.log(remoteJid);
        await bot.sendMessage(remoteJid, { text: `${BOT_EMOJI} Pong?` });
        break;

      case "promover":
        await bot.groupParticipantsUpdate(remoteJid, [quotedMsg], "promote");

        console.log(quotedMsg);

        await bot.sendMessage(
          messages[0].key.remoteJid,
          { text: "Foi promovido a admin do grupo" },
          { quoted: messages[0] }
        );

        break;

      case "rebaixar":
        if (
          quotedMsg == "555195034449@s.whatsapp.net" ||
          quotedMsg == "555592133798@s.whatsapp.net"
        ) {
          await bot.sendMessage(
            messages[0].key.remoteJid,
            { text: "Trouxão Lixo" },
            { quoted: messages[0] }
          );
        } else {
          await bot.groupParticipantsUpdate(remoteJid, [quotedMsg], "demote");

          console.log(quotedMsg);

          await bot.sendMessage(
            messages[0].key.remoteJid,
            { text: "deixou de ser admin do grupo" },
            { quoted: messages[0] }
          );
        }

        break;

      case "ban":
        if (
          quotedMsg == "555195034449@s.whatsapp.net" ||
          quotedMsg == "555592133798@s.whatsapp.net"
        ) {
          await bot.sendMessage(
            messages[0].key.remoteJid,
            { text: "Impossível" },
            { quoted: messages[0] }
          );
        } else {
          console.log(quotedMsg);
          await bot.groupParticipantsUpdate(remoteJid, [quotedMsg], "remove");
          await bot.sendMessage(
            messages[0].key.remoteJid,
            { text: "Foi promovido a vascaiano" },
            { quoted: messages[0] }
          );
        }

        break;

      case "pin":
        await bot.chatModify(
          {
            pin: true, // or `false` to unpin
          },
          quotedMsg
        );
        break;

      case "link":
        const code = await bot.groupInviteCode(remoteJid);
        const info =
          "foi obtido o seguinte link do grupo https://chat.whatsapp.com/".concat(
            code
          );
        await bot.sendMessage(
          messages[0].key.remoteJid,
          { text: info },
          { quoted: messages[0] }
        );
        break;

      case "fechargrupo":
        await bot.groupSettingUpdate(remoteJid, "announcement");
        break;

      case "abrirgrupo":
        await bot.groupSettingUpdate(remoteJid, "not_announcement");
        break;

      case "adm":
        //const response = await bot.sendMessage(remoteJid, { text: 'hello!' }) // send a message

        const number = args;
        const result1 = number.replace("@", "");
        const formato = "KKKK@s.whatsapp.net";
        const result = formato.replace("KKKK", result1);

        console.log(result);

        await bot.groupParticipantsUpdate(remoteJid, [result], "promote");

        console.log(result);

        await bot.sendMessage(
          messages[0].key.remoteJid,
          { text: "Foi promovido a admin do grupo" },
          { quoted: messages[0] }
        );

        break;

      

      case "sticker":
        if (IsImage) {
          const inpuPath = await DownloadImage(baileysMessage, "input");
          const outputPath = path.resolve(TEMP_FOLDER, "output.webp");
          exec(
            `ffmpeg -i ${inpuPath} -vf scale=512:512 ${outputPath} `,
            async (error) => {
              if (error) {
                await bot.sendMessage(
                  messages[0].key.remoteJid,
                  { text: "Ocorreram erros !" },
                  { quoted: messages[0] }
                );
                return;
              }

              await bot.sendMessage(messages[0].key.remoteJid, {
                sticker: { url: outputPath },
              });

              fs.unlinkSync(inpuPath);
              fs.unlinkSync(outputPath);
            }
          );
        } else {
          await bot.sendMessage(
            messages[0].key.remoteJid,
            { text: "Não é uma imagem" },
            { quoted: messages[0] }
          );
        }

        break;


  

      case "remover":
        //const response = await bot.sendMessage(remoteJid, { text: 'hello!' }) // send a message

        const number1 = args;
        const result11 = number1.replace("@", "");
        const formato1 = "KKKK@s.whatsapp.net";
        const result2 = formato1.replace("KKKK", result11);

        await bot.groupParticipantsUpdate(remoteJid, [result2], "remove");

        await bot.sendMessage(
          messages[0].key.remoteJid,
          { text: "Banido com sucesso" },
          { quoted: messages[0] }
        );

        break;
    }
  });
}

module.exports = middlewares;
