import React from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface RenderRichTextProps {
  text: string;
  onInternalNavigate?: (path: string) => void;
  className?: string;
}

/**
 * Parses markdown-style links [Anchor](url) and HTML <a href="url">Anchor</a>,
 * as well as bold **text** and italic *text*, rendering them with proper internal
 * navigation or external target="_blank" safety.
 */
export const RichContentText: React.FC<RenderRichTextProps> = ({
  text,
  onInternalNavigate,
  className = ''
}) => {
  if (!text) return null;

  // Split text by markdown links [label](url) and html links <a href="url">label</a>
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      const plainText = text.substring(lastIndex, match.index);
      elements.push(renderInlineFormatting(plainText, `text-${lastIndex}`));
    }

    const isMarkdown = Boolean(match[1]);
    const label = isMarkdown ? match[1] : match[4];
    const url = isMarkdown ? match[2] : match[3];

    const isExternal = url.startsWith('http://') || url.startsWith('https://');

    if (isExternal) {
      elements.push(
        <a
          key={`ext-link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-[#2271b1] hover:text-[#135e96] font-semibold underline decoration-[#2271b1]/40 hover:decoration-[#135e96] transition-colors"
          title={`External authority link: ${url}`}
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 text-[#2271b1]/70 inline shrink-0 ml-0.5" />
        </a>
      );
    } else {
      // Internal link (e.g. /varieties, /exchange, /locations/rice-supplier-karachi, etc.)
      elements.push(
        <a
          key={`int-link-${match.index}`}
          href={url}
          onClick={(e) => {
            if (onInternalNavigate) {
              e.preventDefault();
              onInternalNavigate(url);
            }
          }}
          className="inline-flex items-center gap-0.5 text-emerald-800 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200/80 transition-all cursor-pointer"
          title={`Internal link to ${url}`}
        >
          <LinkIcon className="w-2.5 h-2.5 text-emerald-700 inline shrink-0 mr-0.5" />
          <span>{label}</span>
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    const plainText = text.substring(lastIndex);
    elements.push(renderInlineFormatting(plainText, `text-${lastIndex}`));
  }

  return <span className={className}>{elements}</span>;
};

/**
 * Handles basic bold (**bold**) and italics (*italic*) within string slices.
 */
function renderInlineFormatting(str: string, keyPrefix: string): React.ReactNode {
  // Regex for bold **text** and *italic*
  const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <React.Fragment key={keyPrefix}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-neutral-950">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={`${keyPrefix}-i-${i}`} className="italic text-neutral-800">{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </React.Fragment>
  );
}
