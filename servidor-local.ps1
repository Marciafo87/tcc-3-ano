# NEXT LEVEL EXPERIENCE - servidor local para Windows (sem instalar nada)
# Uso: clique duas vezes em INICIAR-SITE.bat
param([int]$Port = 8080)
$root = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() } catch {
  Write-Host ""
  Write-Host "ERRO: nao foi possivel usar a porta $Port. Feche outras janelas do servidor e tente de novo." -ForegroundColor Red
  exit 1
}
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8';
  '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg';
  '.jpeg'='image/jpeg'; '.webp'='image/webp'; '.gif'='image/gif'; '.ico'='image/x-icon'; '.md'='text/plain; charset=utf-8'
}
Write-Host ""
Write-Host "  NEXT LEVEL EXPERIENCE rodando!" -ForegroundColor Magenta
Write-Host "  Site:   http://localhost:$Port/"
Write-Host "  Painel: http://localhost:$Port/admin/"
Write-Host ""
Write-Host "  Mantenha esta janela aberta durante a apresentacao. Para encerrar, feche a janela."
Start-Process "http://localhost:$Port/"
while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    $local = [System.IO.Path]::GetFullPath((Join-Path $root ($path.TrimStart('/'))))
    if (-not $local.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
    } elseif ((Test-Path $local -PathType Container) -and -not $path.EndsWith('/')) {
      $res.StatusCode = 301; $res.RedirectLocation = $path + '/'
    } else {
      if (Test-Path $local -PathType Container) { $local = Join-Path $local 'index.html' }
      if (Test-Path $local -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($local).ToLower()
        $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($local)
        $res.ContentType = $ct
        $res.Headers.Add('Cache-Control', 'no-cache')
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      } else {
        $res.StatusCode = 404
        $b = [System.Text.Encoding]::UTF8.GetBytes('Arquivo nao encontrado')
        $res.OutputStream.Write($b, 0, $b.Length)
      }
    }
    $res.OutputStream.Close()
  } catch { }
}
