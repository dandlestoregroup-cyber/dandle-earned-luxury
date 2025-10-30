import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NourModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODELS = ["RelaxMax", "Diva", "ComfortPlus", "CozyCompanion", "EasyUp"];
const SERIES = ["Series 1", "Series 2", "Series 3"];
const COLORS = ["Royal Blue", "Tan Beige", "Urban Charcoal", "Off White", "Chic Red", "Chocolate Brown", "Black"];
const MODES = [
  { value: "exact", label: "Exact Room", desc: "Show recliner only, no décor changes" },
  { value: "upgraded", label: "Upgraded Room", desc: "Subtle décor refinements" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image";
}

const NourModal = ({ open, onOpenChange }: NourModalProps) => {
  const [step, setStep] = useState<"upload" | "select" | "render" | "chat">("upload");
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [model, setModel] = useState("");
  const [series, setSeries] = useState("");
  const [color, setColor] = useState("");
  const [mode, setMode] = useState("");
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomImage(event.target?.result as string);
        setStep("select");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRender = async () => {
    if (!model || !color || !series || !mode) {
      toast({ title: "Please complete all selections", variant: "destructive" });
      return;
    }

    if (editCount >= 3) {
      toast({ title: "Edit limit reached", description: "Please finalize or chat with Nour" });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Recreate the uploaded room photo as-is. Insert a Dandle ${model} recliner in ${color} (${series}). Render mode: ${mode}. Preserve all original lighting and décor. No hallucinations, no architectural changes, realistic shadow blending.`;
      
      const { data, error } = await supabase.functions.invoke("nour-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: roomImage } }
              ]
            }
          ]
        }
      });

      if (error) throw error;

      if (data.type === "image") {
        setRenderedImage(data.content);
        setEditCount(editCount + 1);
        setStep("render");
        toast({ title: "Visualization complete!", description: `${3 - editCount - 1} edits remaining` });
      }
    } catch (error: any) {
      console.error("Render error:", error);
      toast({ title: "Rendering failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nour-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMsg] }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || !line.trim()) continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantText += content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant") {
                    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantText } : m);
                  }
                  return [...prev, { role: "assistant", content: assistantText }];
                });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Chat failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("upload");
    setRoomImage(null);
    setModel("");
    setSeries("");
    setColor("");
    setMode("");
    setRenderedImage(null);
    setEditCount(0);
    setMessages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Nour - AI Comfort Stylist
          </DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">Upload a photo of your room to get started</p>
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload room photo</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {step === "select" && (
          <div className="space-y-4">
            {roomImage && (
              <img src={roomImage} alt="Room" className="w-full h-48 object-cover rounded-lg" />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Series</Label>
                <Select value={series} onValueChange={setSeries}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select series" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Visualization Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODES.map(m => (
                      <SelectItem key={m.value} value={m.value}>
                        <div>
                          <div className="font-medium">{m.label}</div>
                          <div className="text-xs text-muted-foreground">{m.desc}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleRender} disabled={isLoading} className="flex-1">
                {isLoading ? "Rendering..." : "Visualize"}
              </Button>
              <Button variant="outline" onClick={resetFlow}>Start Over</Button>
            </div>
          </div>
        )}

        {step === "render" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Original Room</Label>
                <img src={roomImage!} alt="Original" className="w-full h-64 object-cover rounded-lg" />
              </div>
              <div>
                <Label>With {model} in {color}</Label>
                <img src={renderedImage!} alt="Rendered" className="w-full h-64 object-cover rounded-lg" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {editCount < 3 ? `${3 - editCount} edits remaining` : "Edit limit reached"}
            </p>

            <div className="flex gap-2">
              {editCount < 3 && (
                <Button onClick={() => setStep("select")} variant="outline" className="flex-1">
                  Make Changes
                </Button>
              )}
              <Button onClick={() => setStep("chat")} className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Nour
              </Button>
              <Button variant="outline" onClick={resetFlow}>New Visualization</Button>
            </div>
          </div>
        )}

        {step === "chat" && (
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-lg p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Ask Nour about delivery, pricing, warranty..."
                disabled={isLoading}
              />
              <Button onClick={handleChatSend} disabled={isLoading}>
                Send
              </Button>
            </div>

            <Button variant="outline" onClick={resetFlow} className="w-full">
              Start New Visualization
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NourModal;
