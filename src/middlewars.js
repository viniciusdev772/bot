const {
  isCommand,
  ExtractDataFromMessage,
  DownloadImage,
  DownloadDoc,
} = require("./utils/index");
const { BOT_EMOJI, TEMP_FOLDER } = require("./config");
const path = require("path");
const fs = require("fs");

const { exec } = require("child_process");
async function middlewares(bot) {
  bot.ev.on("messages.upsert", async ({ messages }) => {
    const baileysMessage = messages[0];
    if (!baileysMessage?.message || !isCommand(baileysMessage)) {
      return;
    }
    const { command, remoteJid, key, quotedMsg, args, IsImage } =
      ExtractDataFromMessage(baileysMessage);

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


      case "linkar":
        const inpuPath = await DownloadDoc(baileysMessage, "input");
        const outputPath = path.resolve(TEMP_FOLDER, "output.webp");

        exec(`cp ${inpuPath} /home/viniciusdev.online/public_html/bot/${outputPath} `);
        await bot.sendMessage(
          messages[0].key.remoteJid,
          { text: `url direto do arquivo aqui: https://viniciusdev.online/bot/${outputPath}` },
          { quoted: messages[0] }
        );

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
