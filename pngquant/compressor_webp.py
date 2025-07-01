import os
import sys
import time
from datetime import datetime
from PIL import Image

# Попытка импортировать colorama
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
    C_GREEN, C_YELLOW, C_RED, C_CYAN, C_WHITE, C_BRIGHT = Fore.GREEN, Fore.YELLOW, Fore.RED, Fore.CYAN, Fore.WHITE, Style.BRIGHT
except ImportError:
    print("Библиотека 'colorama' не найдена. Вывод будет без цветов. Для установки: pip install colorama")
    C_GREEN = C_YELLOW = C_RED = C_CYAN = C_WHITE = C_BRIGHT = ""

# --- НАСТРОЙКА ---

# 1. Путь к папке с вашими исходными PNG-изображениями.
root_folder = r"C:\Users\www.yuzu.city\Desktop\yuzu_labs\multi_portal\public\images"

# 2. Качество для WebP (от 0 до 100).
#    75 - золотая середина между качеством и размером.
webp_quality = 75

# 3. Имя файла для логов.
log_file_name = "webp_replace_log.txt"

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
    clean_message = ''.join(filter(lambda char: char.isprintable() or char in '\n\r', message))
    file_handle.write(clean_message + "\n")

def convert_and_replace_with_webp(directory, log_handle):
    """Основная функция конвертации с заменой и удалением оригиналов."""
    
    start_time = time.time()
    
    log_message(f"{C_CYAN}--- Поиск PNG файлов для замены... ---", log_handle)
    png_files_to_process = []
    for dirpath, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.lower().endswith('.png'):
                png_files_to_process.append(os.path.join(dirpath, filename))
    
    total_files = len(png_files_to_process)
    if total_files == 0:
        log_message(f"{C_YELLOW}В указанной папке не найдено PNG файлов.", log_handle)
        return

    log_message(f"{C_GREEN}Найдено файлов для замены: {total_files}\n", log_handle)
    log_message(f"{C_CYAN}--- Начало процесса замены PNG на WebP ---", log_handle)

    # Статистика
    replaced_count = 0
    error_count = 0
    total_original_size = 0
    total_webp_size = 0

    for i, file_path in enumerate(png_files_to_process, 1):
        original_filename = os.path.basename(file_path)
        progress = f"[{i}/{total_files}]"
        
        webp_path = os.path.splitext(file_path)[0] + '.webp'
        webp_filename = os.path.basename(webp_path)
        
        try:
            original_size = os.path.getsize(file_path)
            total_original_size += original_size
            
            with Image.open(file_path) as img:
                img.save(webp_path, 'webp', quality=webp_quality, method=6)
            
            # Проверяем, что новый файл создан, прежде чем удалять старый
            if os.path.exists(webp_path):
                new_size = os.path.getsize(webp_path)
                total_webp_size += new_size
                replaced_count += 1
                
                # Удаляем оригинальный PNG
                os.remove(file_path)
                
                log_message(
                    f"{C_WHITE}{progress} {C_GREEN}✅ ЗАМЕНЕН: {C_BRIGHT}{original_filename}{Style.RESET_ALL} -> {C_BRIGHT}{webp_filename}{Style.RESET_ALL}",
                    log_handle
                )
                log_message(
                    f"   Размер: {get_human_readable_size(original_size)} -> {get_human_readable_size(new_size)} | "
                    f"Экономия: {C_GREEN}{get_human_readable_size(original_size - new_size)}",
                    log_handle
                )
            else:
                raise IOError("Не удалось создать WebP файл.")

        except Exception as e:
            error_count += 1
            # Если была ошибка, размер нового файла 0, а старый остается
            total_webp_size += locals().get('original_size', 0)
            log_message(f"{C_WHITE}{progress} {C_RED}❌ ОШИБКА при замене {original_filename}: {e}", log_handle)
            log_message(f"   {C_YELLOW}Оригинальный файл НЕ был удален.", log_handle)

    # --- Итоговый отчет ---
    end_time = time.time()
    duration = end_time - start_time
    total_saved = total_original_size - total_webp_size
    compression_percent = (total_saved / total_original_size * 100) if total_original_size > 0 else 0

    log_message("\n" + "="*60, log_handle)
    log_message(f"{C_BRIGHT}{C_CYAN}ИТОГОВЫЙ ОТЧЕТ ПО ЗАМЕНЕ PNG НА WEBP", log_handle)
    log_message("="*60, log_handle)
    log_message(f"  {C_WHITE}Всего найдено PNG для замены: {C_BRIGHT}{total_files}", log_handle)
    log_message(f"  {C_GREEN}Успешно заменено: {C_BRIGHT}{replaced_count}", log_handle)
    log_message(f"  {C_RED}Файлов с ошибками: {C_BRIGHT}{error_count}", log_handle)
    log_message("-" * 25, log_handle)
    log_message(f"  {C_WHITE}Исходный размер (PNG): {C_BRIGHT}{get_human_readable_size(total_original_size)}", log_handle)
    log_message(f"  {C_WHITE}Итоговый размер (WebP): {C_BRIGHT}{get_human_readable_size(total_webp_size)}", log_handle)
    log_message(f"  {C_GREEN}Всего сэкономлено места: {C_BRIGHT}{get_human_readable_size(total_saved)}", log_handle)
    log_message(f"  {C_CYAN}Общее сжатие относительно PNG: {C_BRIGHT}{compression_percent:.2f}%", log_handle)
    log_message("-" * 25, log_handle)
    log_message(f"  {C_WHITE}Время выполнения: {C_BRIGHT}{duration:.2f} сек.", log_handle)
    log_message("="*60, log_handle)


if __name__ == "__main__":
    print(f"{C_BRIGHT}--- Скрипт ЗАМЕНЫ PNG на WebP с УДАЛЕНИЕМ оригиналов ---{Style.RESET_ALL}")
    print(f"Папка с изображениями: {C_CYAN}{root_folder}")
    print(f"Качество WebP: {C_CYAN}{webp_quality}")
    
    print(f"\n{C_BRIGHT}{C_RED}❗❗❗ КРАЙНЕ ВАЖНО ❗❗❗")
    print(f"{C_YELLOW}Этот скрипт НАВСЕГДА удалит ваши .png файлы, заменив их на .webp.")
    print(f"Убедитесь, что у вас есть РАБОЧАЯ РЕЗЕРВНАЯ КОПИЯ.{Style.RESET_ALL}")
    
    if not os.path.isdir(root_folder):
        print(f"\n{C_RED}❌ ОШИБКА: Папка с изображениями не найдена.")
    else:
        try:
            answer = input(f"Я понимаю риски и сделал бэкап. Начать замену? (введите 'да'): ")
            if answer.lower() == 'да':
                with open(log_file_name, 'w', encoding='utf-8') as log_f:
                    log_message(f"Лог сессии от {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n", log_f)
                    convert_and_replace_with_webp(root_folder, log_f)
                print(f"\n{C_GREEN}Работа завершена. Подробный лог сохранен в файл: {C_BRIGHT}{log_file_name}")
            else:
                print("Операция отменена.")
        except KeyboardInterrupt:
            print(f"\n\n{C_RED}Процесс прерван пользователем.{Style.RESET_ALL}")