$files = Get-ChildItem -Recurse -File src -Include *.js,*.jsx,*.ts,*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    $imports = [regex]::Matches(
        $content,
        "from\s+['""](\.{1,2}/[^'""]+)['""]|import\s+['""](\.{1,2}/[^'""]+)['""]"
    )

    foreach ($match in $imports) {
        $path = if ($match.Groups[1].Success) {
            $match.Groups[1].Value
        } else {
            $match.Groups[2].Value
        }

        $base = Join-Path $file.DirectoryName $path

        $possible = @(
            "$base.js",
            "$base.jsx",
            "$base.ts",
            "$base.tsx",
            "$base.css",
            "$base"
        )

        $found = $false

        foreach ($p in $possible) {
            if (Test-Path $p) {
                $found = $true
                break
            }
        }

        if (-not $found) {
            Write-Host ""
            Write-Host "MISSING IMPORT:" -ForegroundColor Red
            Write-Host "File: $($file.FullName)"
            Write-Host "Import: $path"
        }
    }
}