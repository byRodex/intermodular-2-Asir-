# Configuración
$DB_SERVICE = "db_mysql"
# Usamos root porque el backup contiene funciones/procedimientos que requieren privilegios SUPER
$DB_USER = "root"
$DB_PASS = "Sysadmin123"
$DB_NAME = "GESTION_PROYECTOS"
$BACKUP_DIR = "./backups"

Write-Host "--- POLITICA DE RECUPERACION (RECOVERY) ---"

# --- PAUSA AÑADIDA PARA ESPERAR AL CONTENEDOR ---
Write-Host "Esperando 3 segundos a que Docker registre el servicio..."
Start-Sleep -Seconds 3 
# ----------------------------------------------------

# 1. ENCONTRAR EL ÚLTIMO ARCHIVO DE BACKUP
# Busca el archivo .sql más reciente en la carpeta de backups
$LAST_BACKUP = Get-ChildItem -Path $BACKUP_DIR -Filter *.sql | Sort-Object LastWriteTime | Select-Object -Last 1

if (-not $LAST_BACKUP) {
  Write-Host "❌ ERROR: No se encontro ningun archivo de backup (.sql) en la carpeta $BACKUP_DIR."
  Write-Host "Primero crea un backup ejecutando ./backup.ps1"
  exit 1
}

Write-Host "✅ Archivo de backup encontrado: $($LAST_BACKUP.Name)"
Write-Host "Restaurando base de datos desde $($LAST_BACKUP.Name)..."

# 2. RESTAURAR LA BASE DE DATOS
# Ejecuta el comando mysql dentro del contenedor para importar el backup
# Usamos MYSQL_PWD como variable de entorno para evitar el warning de seguridad
# Usamos Get-Content con pipe porque PowerShell no soporta el operador < para redirección de entrada
# Usamos el usuario root porque el backup contiene funciones/procedimientos que requieren privilegios SUPER
$env:MYSQL_PWD = $DB_PASS
Get-Content $LAST_BACKUP.FullName | docker exec -i -e MYSQL_PWD=$DB_PASS $DB_SERVICE mysql -u $DB_USER $DB_NAME
$restoreExitCode = $LASTEXITCODE
$env:MYSQL_PWD = $null  # Limpiar la variable de entorno por seguridad

if ($restoreExitCode -eq 0) {
  Write-Host "✅ EXITO: Base de datos restaurada correctamente desde $($LAST_BACKUP.Name)"
  Write-Host "Verifica los datos en http://localhost"
}
else {
  Write-Host "❌ ERROR FATAL: La restauracion fallo."
  Write-Host "Detalles: Verifica que el contenedor $DB_SERVICE este activo y las credenciales sean correctas."
  exit 1
}