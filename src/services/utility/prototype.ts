// prototype.ts
export {} // Marks the file as a module

declare global {
  interface File {
    toDataUrl(): Promise<string>
  }

  interface String {
    capitalize(): string
  }
}

File.prototype.toDataUrl = function (): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(this)
  })
}

String.prototype.capitalize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
