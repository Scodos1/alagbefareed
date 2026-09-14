import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../lib/api';
import { canEmbedInCard } from '../lib/embed';

const FRAME_W = 1280;
const FRAME_H = 800;

export default function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 220, damping: 20 });

  const live = canEmbedInCard(project.slug) && !!project.live_url;
  const frameRef = useRef<HTMLDivElement>(null);
  const [frameScale, setFrameScale] = useState(0.32);
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    if (!live) return;
    const el = frameRef.current;
    if (!el) return;
    const update = () => setFrameScale(el.clientWidth / FRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [live]);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="tilt-scene h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY }}
        className="tilt-card h-full"
      >
        <Link
          to={`/projects/${project.slug}`}
          className="group block h-full border border-[color:var(--color-border)] rounded-lg overflow-hidden bg-[color:var(--color-surface)] hover:border-[color:var(--color-accent)] hover:shadow-[0_20px_48px_-20px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] hover:-translate-y-1 transition-all duration-300"
        >
          <div ref={frameRef} className="aspect-[16/10] bg-[color:var(--color-surface-2)] relative overflow-hidden">
            {live ? (
              <>
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt=""
                    aria-hidden
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${frameLoaded ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                  />
                )}
                <div
                  className={`absolute top-0 left-0 transition-opacity duration-700 ${frameLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${frameScale})`, transformOrigin: 'top left' }}
                >
                  <iframe
                    src={project.live_url!}
                    title={`${project.name} — live preview`}
                    loading="lazy"
                    onLoad={() => setFrameLoaded(true)}
                    width={FRAME_W}
                    height={FRAME_H}
                    scrolling="no"
                    tabIndex={-1}
                    aria-hidden
                    className="border-0 bg-white pointer-events-none block"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                </div>
                <span className="absolute bottom-3 right-3 mono text-[10px] uppercase tracking-widest bg-[color:var(--color-bg)]/90 text-[color:var(--color-accent)] px-2 py-1 rounded flex items-center gap-1.5">
                  <span className="dot-pulse" /> Live
                </span>
              </>
            ) : project.image_url ? (
              <img
                src={project.image_url}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 code-grid" aria-hidden />
            )}
            {!project.image_url && !live && (
              <div className="absolute inset-0 flex items-center justify-center serif text-5xl italic text-[color:var(--color-accent)]">
                {project.name[0]}
              </div>
            )}
            {project.featured && (
              <span className="absolute top-3 left-3 mono text-[10px] uppercase tracking-widest bg-[color:var(--color-accent)] text-white px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--color-muted)]">{project.category}</span>
              <ArrowUpRight size={16} className="text-[color:var(--color-muted)] group-hover:text-[color:var(--color-accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="serif text-2xl leading-tight mb-1">{project.name}</h3>
            <p className="text-sm text-[color:var(--color-muted)] line-clamp-2 mb-3">{project.tagline || project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((t) => (
                <span key={t} className="mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-muted)] group-hover:border-[color:var(--color-accent)]/40 transition-colors">{t}</span>
              ))}
              {project.technologies.length > 4 && (
                <span className="mono text-[10px] uppercase tracking-wide px-2 py-0.5 text-[color:var(--color-muted)]">+{project.technologies.length - 4}</span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
