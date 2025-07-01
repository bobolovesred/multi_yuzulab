import os
import sys
import subprocess
import time
from datetime import datetime

# Попытка импортировать colorama, если не получится - работаем без цветов
try:
    from colorama import init, Fore, Style
    init(autoreset=True) # Автоматически сбрасывать цвет после каждого print
    C_GREEN = Fore.GREEN
    C_YELLOW = Fore.YELLOW
    C_RED = Fore.RED
    C_CYAN = Fore.CYAN
    C_WHITE = Fore.WHITE
    C_BRIGHT = Style.BRIGHT
except ImportError:
    print("Библиотека 'colorama' не найдена. Вывод будет без цветов. Для установки: pip install colorama")
    # Создаем "пустышки", чтобы скрипт не сломался
    C_GREEN = C_YELLOW = C_RED = C_CYAN = C_WHITE = C_BRIGHT = ""


# --- НАСТРОЙКА ---

# 1. Путь к папке с вашими изображениями.
root_folder = r"C:\Users\www.yuzu.city\Desktop\yuzu_labs\multi_portal\public\images"

# 2. Путь к исполняемому файлу pngquant.exe.
pngquant_path = r"C:\Users\www.yuzu.city\Desktop\yuzu_labs\multi_portal\pngquant\pngquant.exe"

# 3. Настройки качества для pngquant (диапазон 0-100).
quality_range = "65-80"

# 4. Имя файла для логов.
log_file_name = "compression_log.txt"

# -----------------

def get_human_readable_size(size_in_bytes):
    """Преобразует байты в читаемый формат (КБ, МБ)."""
    if size_in_bytes is None: return "N/A"
    if size_in_bytes < 1024: return f"{size_in_bytes} B"
    if size_in_bytes < 1024**2: return f"{size_in_bytes/1024:.2f} KB"
    return f"{size_in_bytes/1024**2:.2f} MB"

def log_message(message, file_handle):
    """Записывает сообщение в консоль и в лог-файл."""
    print(message)
    # Убираем ANSI-коды цветов перед записью в файл
    clean_message = ''.join(filter(lambda char: char.isprintable() or char in '\n\r', message))
    file_handle.write(clean_message + "\n")

def compress_with_pngquant(directory, log_handle):
    """Основная функция сжатия с детальным логированием."""
    
    start_time = time.time()
    
    log_message(f"{C_CYAN}--- Поиск PNG файлов... ---", log_handle)
    png_files_to_process = []
    for dirpath, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.lower().endswith('.png'):
                png_files_to_process.append(os.path.join(dirpath, filename))
    
    total_files = len(png_files_to_process)
    if total_files == 0:
        log_message(f"{C_YELLOW}В указанной папке не найдено PNG файлов.", log_handle)
        return

    log_message(f"{C_GREEN}Найдено файлов для обработки: {total_files}\n", log_handle)
    log_message(f"{C_CYAN}--- Начало процесса сжатия ---", log_handle)

    # Статистика
    processed_count = 0
    skipped_count = 0
    error_count = 0
    total_original_size = 0
    total_new_size = 0

    for i, file_path in enumerate(png_files_to_process, 1):
        filename = os.path.basename(file_path)
        progress = f"[{i}/{total_files}]"
        
        try:
            original_size = os.path.getsize(file_path)
            total_original_size += original_size
            
            command = [
                pngquant_path, "--force", "--ext", ".png", "--quality", quality_range,
                "--skip-if-larger", "--", file_path
            ]
            
            result = subprocess.run(command, check=True, capture_output=True, text=True, encoding='utf-8')
            
            new_size = os.path.getsize(file_path)
            saved_bytes = original_size - new_size
            
            if saved_bytes > 0:
                processed_count += 1
                total_new_size += new_size
                log_message(
                    f"{C_WHITE}{progress} {C_GREEN}✅ Сжат: {C_BRIGHT}{filename}{Style.RESET_ALL} | "
                    f"Было: {get_human_readable_size(original_size)} -> "
                    f"Стало: {get_human_readable_size(new_size)} | "
                    f"Экономия: {C_GREEN}{get_human_readable_size(saved_bytes)}",
                    log_handle
                )
            else:
                # Этого не должно быть из-за --skip-if-larger, но на всякий случай
                skipped_count += 1
                total_new_size += original_size
                log_message(f"{C_WHITE}{progress} {C_YELLOW}⚪ Пропущен (размер не уменьшился): {filename}", log_handle)

        except subprocess.CalledProcessError as e:
            if e.returncode == 99: # Код pngquant для пропущенных файлов
                skipped_count += 1
                total_new_size += os.path.getsize(file_path) # Размер не изменился
                log_message(f"{C_WHITE}{progress} {C_YELLOW}⚪ Пропущен (уже оптимален): {filename}", log_handle)
            else:
                error_count += 1
                total_new_size += os.path.getsize(file_path) # Размер не изменился
                log_message(f"{C_WHITE}{progress} {C_RED}❌ ОШИБКА pngquant: {filename} | {e.stderr.strip()}", log_handle)
        except Exception as e:
            error_count += 1
            # Размер мог не измениться, добавляем старый
            total_new_size += locals().get('original_size', 0)
            log_message(f"{C_WHITE}{progress} {C_RED}❌ КРИТИЧЕСКАЯ ОШИБКА: {filename} | {e}", log_handle)

    # --- Итоговый отчет ---
    end_time = time.time()
    duration = end_time - start_time
    total_saved = total_original_size - total_new_size
    compression_percent = (total_saved / total_original_size * 100) if total_original_size > 0 else 0

    log_message("\n" + "="*50, log_handle)
    log_message(f"{C_BRIGHT}{C_CYAN}ИТОГОВЫЙ ОТЧЕТ", log_handle)
    log_message("="*50, log_handle)
    log_message(f"  {C_WHITE}Всего файлов обработано: {C_BRIGHT}{total_files}", log_handle)
    log_message(f"  {C_GREEN}Успешно сжато: {C_BRIGHT}{processed_count}", log_handle)
    log_message(f"  {C_YELLOW}Пропущено (уже оптимальны): {C_BRIGHT}{skipped_count}", log_handle)
    log_message(f"  {C_RED}Файлов с ошибками: {C_BRIGHT}{error_count}", log_handle)
    log_message("-" * 20, log_handle)
    log_message(f"  {C_WHITE}Исходный размер всех файлов: {C_BRIGHT}{get_human_readable_size(total_original_size)}", log_handle)
    log_message(f"  {C_WHITE}Итоговый размер всех файлов: {C_BRIGHT}{get_human_readable_size(total_new_size)}", log_handle)
    log_message(f"  {C_GREEN}Всего сэкономлено места: {C_BRIGHT}{get_human_readable_size(total_saved)}", log_handle)
    log_message(f"  {C_CYAN}Общее сжатие: {C_BRIGHT}{compression_percent:.2f}%", log_handle)
    log_message("-" * 20, log_handle)
    log_message(f"  {C_WHITE}Время выполнения: {C_BRIGHT}{duration:.2f} сек.", log_handle)
    log_message("="*50, log_handle)


if __name__ == "__main__":
    print(f"{C_BRIGHT}--- Скрипт агрессивного сжатия PNG ---{Style.RESET_ALL}")
    print(f"Папка с изображениями: {C_CYAN}{root_folder}")
    print(f"Утилита сжатия: {C_CYAN}{pngquant_path}")
    print(f"Качество: {C_CYAN}{quality_range}")
    
    if not os.path.isdir(root_folder):
        print(f"\n{C_RED}❌ ОШИБКА: Папка с изображениями не найдена.")
    elif not os.path.isfile(pngquant_path):
        print(f"\n{C_RED}❌ ОШИБКА: Файл pngquant.exe не найден.")
    else:
        print(f"\n{C_BRIGHT}{C_YELLOW}❗ ВНИМАНИЕ! Скрипт необратимо перезапишет ваши файлы.{Style.RESET_ALL}")
        try:
            answer = input(f"Вы сделали резервную копию? (введите 'да' для продолжения): ")
            if answer.lower() == 'да':
                # Открываем лог-файл на запись
                with open(log_file_name, 'w', encoding='utf-8') as log_f:
                    log_message(f"Лог сессии от {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n", log_f)
                    compress_with_pngquant(root_folder, log_f)
                print(f"\n{C_GREEN}Работа завершена. Подробный лог сохранен в файл: {C_BRIGHT}{log_file_name}")
            else:
                print("Операция отменена.")
        except KeyboardInterrupt:
            print("\n\n{C_RED}Процесс прерван пользователем.{Style.RESET_ALL}")