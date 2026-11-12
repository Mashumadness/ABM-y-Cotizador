$tokenInfo = "protocol=https`nhost=github.com" | git credential fill
$tokenLine = ($tokenInfo | Select-String "password=").Line
$token = $tokenLine.Substring("password=".Length)

$releaseId = "442543547"

function Upload-Asset([string]$filePath, [string]$assetName) {
    Write-Output "Iniciando subida de $assetName ($([math]::Round((Get-Item $filePath).Length / 1MB, 2)) MB)..."
    
    $uploadUri = "https://uploads.github.com/repos/Mashumadness/ABM-y-Cotizador/releases/$releaseId/assets?name=$assetName"
    
    $httpClient = [System.Net.Http.HttpClient]::new()
    $httpClient.Timeout = [System.TimeSpan]::FromMinutes(10)
    $httpClient.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new("Bearer", $token)
    $httpClient.DefaultRequestHeaders.Add("User-Agent", "PowerShell-Release-Uploader")
    $httpClient.DefaultRequestHeaders.Add("Accept", "application/vnd.github+json")
    
    $fileStream = [System.IO.File]::OpenRead($filePath)
    $content = [System.Net.Http.StreamContent]::new($fileStream)
    $content.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::new("application/octet-stream")
    
    $response = $httpClient.PostAsync($uploadUri, $content).GetAwaiter().GetResult()
    $responseBody = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
    
    $fileStream.Close()
    $fileStream.Dispose()
    $httpClient.Dispose()
    
    if ($response.IsSuccessStatusCode) {
        $json = $responseBody | ConvertFrom-Json
        Write-Output "Subida exitosa: $($json.browser_download_url)"
    } else {
        Write-Error "Fallo en la subida: $($response.StatusCode) - $responseBody"
    }
}

Upload-Asset "C:\Users\msuar\Desktop\ABM y Cotizador\dist-electron\Tiker - Cotizador Setup 1.0.0.exe" "Tiker-Cotizador-Setup-1.0.0.exe"
Upload-Asset "C:\Users\msuar\Desktop\ABM y Cotizador\dist-electron\Tiker - Cotizador 1.0.0.exe" "Tiker-Cotizador-Portable-1.0.0.exe"
