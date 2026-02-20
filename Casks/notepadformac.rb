cask "notepadformac" do
  version "1.0.4"

  on_intel do
    sha256 "236f1e9cdabbb0cb93811239b3c45d28b25d7de15bd0c09f37d82477c2f2c523"
    url "https://github.com/Arijit-gotsomecodes/NotepadMac---Windows-Notepad-For-Mac/releases/download/app-v#{version}/NotepadMac_#{version}_x64.dmg"
  end
  on_arm do
    sha256 "d3fc7ba5b183356f2e5f870eed351264829e728aa0eada929b956fffafbb7545"
    url "https://github.com/Arijit-gotsomecodes/NotepadMac---Windows-Notepad-For-Mac/releases/download/app-v#{version}/NotepadMac_#{version}_aarch64.dmg"
  end

  name "NotepadMac"
  desc "A modern, fast, and lightweight Notepad for macOS"
  homepage "https://github.com/Arijit-gotsomecodes/NotepadMac---Windows-Notepad-For-Mac"

  app "NotepadMac.app"

  zap trash: [
    "~/Library/Application Support/com.arijit-deb.notepadmac",
    "~/Library/Caches/com.arijit-deb.notepadmac",
    "~/Library/Preferences/com.arijit-deb.notepadmac.plist",
    "~/Library/Saved Application State/com.arijit-deb.notepadmac.savedState",
  ]
end
