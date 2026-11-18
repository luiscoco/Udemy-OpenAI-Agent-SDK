param(
    [Parameter(Mandatory = $true)][string]$ManifestPath,
    [string]$VoiceName = 'Microsoft Zira Desktop',
    [ValidateRange(-10,10)][int]$VoiceRate = 0
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
Add-Type -ReferencedAssemblies System.Speech -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Speech.Synthesis;
using System.Speech.AudioFormat;

public class LessonWordMark {
    public int CharacterPosition { get; set; }
    public int CharacterCount { get; set; }
    public double AudioSeconds { get; set; }
}

public static class LessonNarrator {
    private static SpeechSynthesizer narrator;
    public static LessonWordMark[] Render(string text, string output, string voice, int rate) {
        var marks = new List<LessonWordMark>();
        if (narrator == null) narrator = new SpeechSynthesizer();
        var synth = narrator;
        {
            synth.SelectVoice(voice);
            synth.Rate = rate;
            synth.Volume = 100;
            EventHandler<SpeakProgressEventArgs> handler = (sender, item) => marks.Add(new LessonWordMark {
                CharacterPosition = item.CharacterPosition,
                CharacterCount = item.CharacterCount,
                AudioSeconds = item.AudioPosition.TotalSeconds
            });
            synth.SpeakProgress += handler;
            synth.SetOutputToWaveFile(output, new SpeechAudioFormatInfo(16000, AudioBitsPerSample.Sixteen, AudioChannel.Mono));
            synth.Speak(text);
            synth.SetOutputToNull();
            synth.SpeakProgress -= handler;
        }
        return marks.ToArray();
    }
    public static void Close() { if (narrator != null) { narrator.Dispose(); narrator = null; } }
}
'@
$lessonManifest = Get-Content -LiteralPath $ManifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($lessonScene in $lessonManifest.scenes) {
    $lessonMarks = [LessonNarrator]::Render($lessonScene.speech, $lessonScene.wav, $VoiceName, $VoiceRate)
    ConvertTo-Json -InputObject @($lessonMarks) -Depth 5 | Set-Content -LiteralPath $lessonScene.marks -Encoding UTF8
}
[LessonNarrator]::Close()
Write-Output "Synthesized $($lessonManifest.scenes.Count) scenes with $VoiceName."
