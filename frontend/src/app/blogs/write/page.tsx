"use client";
import { useState, useEffect } from "react";
import { Send, Eye, Code, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/sections/Navigation";
import Footer from "@/sections/Footer";
import { useRouter } from "next/navigation";

const BlogWritePage = () => {
  const router = useRouter();

  const [markdown, setMarkdown] = useState<string>(`#Your Blog Title

Paste your blog content here. You can include:

- Images: ![Screenshot](https://i.ibb.co/DdL9zJp/n8ndualite-mp4-Google-Drive-Opera-07-08-2025-20-38-09.png)
- Code blocks:
\`\`\`js
console.log("Hello, world!");
\`\`\`
- YouTube embeds: paste the full iframe like this:

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=PujgDtTYXtCYBYgr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

##Subheading Example

You can also **bold text** or *italic text* inline.

###Another Subheading

Add more content here. Images, links, and code blocks will render nicely.
`);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem("blog_draft");
    if (savedDraft) {
      const { title, author, tags, markdown } = JSON.parse(savedDraft);
      setTitle(title);
      setAuthor(author);
      setTags(tags);
      setMarkdown(markdown);
    }
  }, []);

  const parseMarkdown = (text: string) => {
    let html = text;

    html = html.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_match, _lang, code) =>
        `<pre><code class="bg-[#1C1C21] text-gray-300 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4 block">${(code || "")
          .trim()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
    );

    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-xl w-full max-w-full max-h-[500px] object-contain border border-white/10 shadow-md my-6" />'
    );

    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-[#1C1C21] text-primary px-2 py-1 rounded text-sm">$1</code>'
    );

    html = html.replace(/^###\s*(.*)$/gim, '<h3 class="text-2xl font-semibold text-white mb-2 mt-4">$1</h3>');
    html = html.replace(/^##\s*(.*)$/gim, '<h2 class="text-3xl font-bold text-white mb-3 mt-6">$1</h2>');
    html = html.replace(/^#\s*(.*)$/gim, '<h1 class="text-4xl font-bold text-white mb-4 mt-8 first:mt-0">$1</h1>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>');

    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:text-green-400 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html = html
      .split("\n")
      .map((line) => {
        if (!line.trim()) return "";
        if (line.startsWith("<")) return `<div class="my-6">${line}</div>`;
        return `<p class="text-gray-300 mb-4 leading-relaxed">${line}</p>`;
      })
      .join("\n");

    return html;
  };

  const MarkdownPreview = ({ content }: { content: string }) => (
    <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
  );

  const handleSaveDraft = () => {
    const draft = { title, author, tags, markdown };
    localStorage.setItem("blog_draft", JSON.stringify(draft));
    alert("📝 Draft saved locally!");
  };

  const handlePublish = () => {
    const newBlog = {
      id: Date.now(),
      title,
      author,
      tags: tags.split(",").map((t) => t.trim()),
      content: markdown,
      date: new Date().toLocaleString(),
    };

    const existingBlogs = JSON.parse(localStorage.getItem("published_blogs") || "[]");
    existingBlogs.push(newBlog);
    localStorage.setItem("published_blogs", JSON.stringify(existingBlogs));

    localStorage.removeItem("blog_draft");

    alert("✅ Blog published successfully!");
    router.push("/blogs");
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#0A0A0A] pt-30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create Your <span className="text-gradient">Blog Post</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Compose your blog post in Markdown and see a live professional preview. Paste YouTube iframe code directly for videos.
            </p>
          </div>

          <div className="glass rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your blog title"
                  className="w-full px-4 py-2 bg-[#1C1C21] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-[#1C1C21] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Comma-separated keywords"
                  className="w-full px-4 py-2 bg-[#1C1C21] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-xl overflow-hidden">
              <div className="bg-[#1C1C21] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-white">Markdown Editor</span>
                </div>
                <span className="text-xs text-gray-400">{markdown.length} characters</span>
              </div>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[600px] p-6 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                placeholder="Write your blog in Markdown. Supports images, code, and iframe embeds."
                spellCheck={false}
              />
            </div>

            <div className="glass rounded-xl overflow-hidden">
              <div className="bg-[#1C1C21] px-6 py-3 border-b border-white/10 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-white">Live Preview</span>
              </div>
              <div className="p-6 h-[600px] overflow-y-auto prose prose-invert max-w-none">
                <MarkdownPreview content={markdown} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button onClick={handleSaveDraft} variant="outline" className="glass glass-hover border-white/10 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish} className="button-gradient">
              <Send className="w-4 h-4 mr-2" />
              Publish Blog
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogWritePage;
