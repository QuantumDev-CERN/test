"use client";
import { useEffect, useState } from "react";
import { Eye, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/sections/Navigation";
import Footer from "@/sections/Footer";

interface Blog {
    id: number;
    title: string;
    author: string;
    tags: string[];
    content: string;
    date?: string;
}

const BlogsPage = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("published_blogs");
            if (saved) {
                const parsed: Blog[] = JSON.parse(saved);
                setBlogs(parsed);
            }
        } catch (err) {
            console.error("Error reading blogs from localStorage:", err);
            setBlogs([]);
        }
    }, []);

    const parseMarkdown = (text: string) => {
        let html = text;

        html = html.replace(
            /```(\w+)?\n([\s\S]*?)```/g,
            (_match, _lang, code) =>
                `<pre class="my-4 overflow-x-auto"><code class="bg-[#1C1C21] text-gray-300 p-4 rounded-lg font-mono text-sm">${(code || "")
                    .trim()
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</code></pre>`
        );

        html = html.replace(
            /!\[([^\]]*)\]\(([^)]+)\)/g,
            '<img src="$2" alt="$1" class="rounded-xl w-full max-w-full max-h-[400px] object-contain border border-white/10 shadow-md my-6" />'
        );

        html = html.replace(
            /`([^`]+)`/g,
            '<code class="bg-[#1C1C21] text-green-400 px-2 py-1 rounded text-sm">$1</code>'
        );

        html = html.replace(/^###\s*(.*)$/gim, '<h3 class="text-2xl font-semibold text-white mb-3 mt-6">$1</h3>');
        html = html.replace(/^##\s*(.*)$/gim, '<h2 class="text-3xl font-bold text-white mb-4 mt-8">$1</h2>');
        html = html.replace(/^#\s*(.*)$/gim, '<h1 class="text-4xl font-bold text-white mb-6 mt-10 first:mt-0">$1</h1>');

        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-200">$1</em>');

        html = html.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-green-400 hover:text-green-600 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        html = html
            .split("\n")
            .map((line) => {
                if (!line.trim()) return "";
                if (line.startsWith("<")) return `<div class="my-4">${line}</div>`;
                return `<p class="text-gray-300 mb-4 leading-relaxed">${line}</p>`;
            })
            .join("\n");

        return html;
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-5">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
                        Explore <span className="text-gradient">Published Blogs</span>
                    </h1>

                    {blogs.length === 0 ? (
                        <p className="text-gray-400 text-lg text-center">No blogs found. Try publishing one!</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="glass p-6 border border-white/10 rounded-2xl hover:border-green-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2">{blog.title}</h2>
                                        <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                                            <User className="w-4 h-4" />
                                            <span>{blog.author || "Unknown"}</span>
                                        </div>

                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {blog.tags.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-green-400/10 border border-green-400/20 rounded-full text-green-400 text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <Tag className="w-3 h-3" /> {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setSelectedBlog(blog)}
                                        className="w-full flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 hover:from-green-600 hover:to-green-400 text-white font-semibold rounded-lg py-2 mt-4 shadow-md transition-all"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Blog
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedBlog && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border border-green-400/20">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
                            onClick={() => setSelectedBlog(null)}
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{selectedBlog.title}</h1>
                            <p className="text-gray-400 text-sm md:text-base mb-4 flex items-center gap-2">
                                <User className="w-4 h-4" /> By {selectedBlog.author}
                            </p>

                            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedBlog.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium"
                                        >
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedBlog.content) }}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default BlogsPage;
