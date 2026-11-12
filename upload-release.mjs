import fs from 'fs';
import { execSync } from 'child_process';

const tokenInfo = execSync('git credential fill', {
  input: 'protocol=https\nhost=github.com\n'
}).toString();

const tokenMatch = tokenInfo.match(/password=(.+)/);
if (!tokenMatch) {
  console.error('No se pudo obtener el token de git');
  process.exit(1);
}
const token = tokenMatch[1].trim();

const releaseId = '442543547';
const owner = 'Mashumadness';
const repo = 'ABM-y-Cotizador';

async function uploadAsset(filePath, assetName) {
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Subiendo ${assetName} (${sizeMB} MB) a GitHub Releases...`);

  const fileBuffer = fs.readFileSync(filePath);
  const uploadUrl = `https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${assetName}`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size.toString(),
      'User-Agent': 'Node-Release-Uploader',
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: fileBuffer
  });

  if (res.ok) {
    const data = await res.json();
    console.log(`✅ Subido exitosamente: ${data.browser_download_url}`);
  } else {
    const errText = await res.text();
    console.error(`❌ Error al subir (${res.status}): ${errText}`);
  }
}

async function main() {
  await uploadAsset(
    'C:/Users/msuar/Desktop/ABM y Cotizador/dist-electron/Tiker - Cotizador Setup 1.0.0.exe',
    'Tiker-Cotizador-Setup-1.0.0.exe'
  );
  await uploadAsset(
    'C:/Users/msuar/Desktop/ABM y Cotizador/dist-electron/Tiker - Cotizador 1.0.0.exe',
    'Tiker-Cotizador-Portable-1.0.0.exe'
  );
  console.log('\n🎉 ¡Todos los ejecutables fueron publicados en GitHub Releases con éxito!');
}

main().catch(console.error);
