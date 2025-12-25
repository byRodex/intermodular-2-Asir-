# Configuración del contenedor (debe coincidir con docker-compose.yml)
$DB_SERVICE="db_mysql"
$DB_NAME="GESTION_PROYECTOS"
$DB_USER="admin_proyectos"
# IMPORTANTE: Reemplaza con tu contraseña robusta real
$DB_PASS="SQLpasswd123" 
$BACKUP_DIR="./backups"

# Crear la carpeta de backups si no existe
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Force -Path $BACKUP_DIR | Out-Null
}

# Define el nombre del archivo con la fecha/hora
$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HHmmss"
$BACKUP_FILE = "$BACKUP_DIR\${DB_NAME}_${TIMESTAMP}.sql"

Write-Host "--- POLÍTICA DE COPIA DE SEGURIDAD (BACKUP) ---"
Write-Host "Generando copia de seguridad en $BACKUP_FILE..."

# Comando principal: docker exec para ejecutar mysqldump dentro del contenedor.
# La salida se redirige (>) a un archivo en el host (tu PC).
# Usamos MYSQL_PWD como variable de entorno para evitar el warning de seguridad
$env:MYSQL_PWD = $DB_PASS
docker exec -i -e MYSQL_PWD=$DB_PASS $DB_SERVICE /usr/bin/mysqldump `
  -u"$DB_USER" `
  --single-transaction `
  $DB_NAME `
  > $BACKUP_FILE
$env:MYSQL_PWD = $null  # Limpiar la variable de entorno por seguridad

# Comprobación (Verificando si el archivo se creó y no está vacío)
if ((Test-Path $BACKUP_FILE) -and ((Get-Item $BACKUP_FILE).length -gt 1024)) {
  Write-Host "✅ Backup completado con éxito. Tamaño: $((Get-Item $BACKUP_FILE).length / 1kb) KB"
} else {
  Write-Host "❌ ERROR: Falló el backup o el archivo es demasiado pequeño. Verifica el estado del contenedor."
}