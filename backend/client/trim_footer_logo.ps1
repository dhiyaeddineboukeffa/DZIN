Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\bob\Desktop\PROJECT DZIN\dzin-shop\public\logo-footer.png"
$destPath = "c:\Users\bob\Desktop\PROJECT DZIN\dzin-shop\public\logo-footer-trimmed.png"

Write-Host "Loading image from $sourcePath..."
$img = [System.Drawing.Bitmap]::FromFile($sourcePath)
$width = $img.Width
$height = $img.Height

$minX = $width
$minY = $height
$maxX = 0
$maxY = 0

Write-Host "Scanning image dimensions: $width x $height"

# Scan for non-transparent/non-white pixels
for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $img.GetPixel($x, $y)
        
        # Check if pixel is NOT transparent AND NOT white (with some tolerance)
        # Alpha > 10 (not fully transparent)
        # R, G, B < 250 (not fully white)
        if ($pixel.A -gt 10 -and ($pixel.R -lt 250 -or $pixel.G -lt 250 -or $pixel.B -lt 250)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

if ($maxX -lt $minX) {
    Write-Host "No content found to crop!"
    $img.Dispose()
    exit
}

# Add a small padding
$padding = 5
$minX = [Math]::Max(0, $minX - $padding)
$minY = [Math]::Max(0, $minY - $padding)
$maxX = [Math]::Min($width - 1, $maxX + $padding)
$maxY = [Math]::Min($height - 1, $maxY + $padding)

$rectWidth = $maxX - $minX + 1
$rectHeight = $maxY - $minY + 1

Write-Host "Cropping to: X=$minX, Y=$minY, W=$rectWidth, H=$rectHeight"

$cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $rectWidth, $rectHeight)
$croppedImg = $img.Clone($cropRect, $img.PixelFormat)

$croppedImg.Save($destPath)
$croppedImg.Dispose()
$img.Dispose()

Write-Host "Success! Saved trimmed logo to $destPath"
