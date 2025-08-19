/**
 * Telegram Channel Search
 * Author : gienetic
 * Base   : https://sownloader.com
 */

const axios = require("axios");
const cheerio = require("cheerio");

async function smuledl(smuleUrl) {
  if (!smuleUrl) return { status: false, msg: "URL Smule wajib diisi" };

  const target = "https://sownloader.com/index.php?url=" + encodeURIComponent(smuleUrl);

  try {
    const { data } = await axios.get(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    });

    const $ = cheerio.load(data);

    const title = $("h4 a").first().text().trim() || "No title available";
    const smule_link = $("h4 a").attr("href") || smuleUrl;
    const thumbnail = $(".sownloader-web-thumbnail").attr("src") || "";
    
    let description = "";
    const descriptionElement = $(".sownloader-web-thumbnail").closest(".row").find("p").first();
    if (descriptionElement.length) {
      description = descriptionElement.text().trim();
    }

    let audio_m4a = $("a.btn[href*='.m4a']").attr("href");
    if (audio_m4a && audio_m4a.startsWith("/")) {
      audio_m4a = "https://sownloader.com" + audio_m4a;
    }

    let audio_mp3 = null;
    const mp3Button = $("button.btn:contains('Download as MP3')");
    if (mp3Button.length) {
      const onclick = mp3Button.attr("onclick");
      if (onclick) {
        const match = onclick.match(/'([^']+\.m4a)'/);
        if (match && match[1]) {
          audio_mp3 = "https://sownloader.com/system/modules/downloader.php?url=" +
            encodeURIComponent(match[1]) +
            "&name=" + encodeURIComponent(title) + "&ext=mp3";
        }
      }
    }

    let video_mp4 = $("a.btn[href*='.mp4']").attr("href");
    if (video_mp4 && video_mp4.startsWith("/")) {
      video_mp4 = "https://sownloader.com" + video_mp4;
    }

    return {
      status: true,
      metadata: {
        title,
        smule_link,
        thumbnail,
        description
      },
      audio: {
        m4a: audio_m4a,
        mp3: audio_mp3
      },
      video: {
        mp4: video_mp4
      }
    };
  } catch (err) {
    console.error("Error in smuledl:", err.message);
    return { status: false, msg: "Gagal mengambil data: " + err.message };
  }
}

module.exports = smuledl;