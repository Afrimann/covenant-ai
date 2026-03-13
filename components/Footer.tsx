export default function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-white/80">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-semibold text-white">
                CA
              </span>
              <span className="text-lg font-semibold text-(--color-primary)">
                Covenant AI
              </span>
            </div>
            <p className="font-serif text-sm text-(--color-muted)">
              &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
              {" "}Psalm 119:105
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-(--color-primary)">Product</p>
              <a href="#features" className="block text-(--color-muted)">
                Features
              </a>
              <a href="#pricing" className="block text-(--color-muted)">
                Pricing
              </a>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-(--color-primary)">Resources</p>
              <a href="/blog" className="block text-(--color-muted)">
                Blog
              </a>
              <a href="/docs" className="block text-(--color-muted)">
                Documentation
              </a>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-(--color-primary)">Company</p>
              <a href="/about" className="block text-(--color-muted)">
                About
              </a>
              <a href="/contact" className="block text-(--color-muted)">
                Contact
              </a>
            </div>
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-(--color-primary)">Legal</p>
              <a href="/terms" className="block text-(--color-muted)">
                Terms
              </a>
              <a href="/privacy" className="block text-(--color-muted)">
                Privacy
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-(--color-muted)">
          Copyright 2026 Covenant AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
