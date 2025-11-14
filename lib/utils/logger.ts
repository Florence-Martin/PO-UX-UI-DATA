/**
 * Système de logging centralisé
 * En production (sur Vercel), seules les erreurs sont affichées
 * En développement, tous les logs sont visibles
 */

type LogLevel = "info" | "warn" | "error" | "debug";

const isDevelopment = process.env.NODE_ENV === "development";

class Logger {
  private log(level: LogLevel, message: string, ...args: any[]): void {
    // En production, on affiche seulement les erreurs
    if (!isDevelopment && level !== "error") {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "error":
        console.error(prefix, message, ...args);
        break;
      case "warn":
        console.warn(prefix, message, ...args);
        break;
      case "info":
        console.info(prefix, message, ...args);
        break;
      case "debug":
        console.debug(prefix, message, ...args);
        break;
    }
  }

  info(message: string, ...args: any[]): void {
    this.log("info", message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log("warn", message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log("error", message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log("debug", message, ...args);
  }
}

export const logger = new Logger();
