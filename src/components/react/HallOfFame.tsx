import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import type {
  ParticipantData,
  AreaFilter,
  WinsFilter,
  RankTier,
} from './HallOfFame.types';
import {
  getRankTier,
  getMedalEmoji,
  getRankLabel,
} from './HallOfFame.types';
import { AnimatedCounter } from './AnimatedCounter';

const FireEffect = lazy(() =>
  import('./FireEffect').then((m) => ({ default: m.FireEffect }))
);

interface HallOfFameProps {
  participants: ParticipantData[];
}

const AREAS = [
  'all',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Product',
] as const;

const WINS_FILTERS = ['all', '1+', '2+', '3+'] as const;

export function HallOfFame({ participants }: HallOfFameProps) {
  const [areaFilter, setAreaFilter] = useState<AreaFilter>('all');
  const [winsFilter, setWinsFilter] = useState<WinsFilter>('all');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const areaMatch = areaFilter === 'all' || p.area === areaFilter;
    let winsMatch = true;

    if (winsFilter === '1+') winsMatch = p.wins >= 1;
    else if (winsFilter === '2+') winsMatch = p.wins >= 2;
    else if (winsFilter === '3+') winsMatch = p.wins >= 3;

    return areaMatch && winsMatch;
  });

  // Re-rank after filtering
  const rankedParticipants = filteredParticipants.map((p, idx) => ({
    ...p,
    rank: idx + 1,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getRankTierClass = (rank: number): string => {
    if (rank === 1) return 'rank-1-border';
    if (rank === 2) return 'rank-2-border';
    if (rank === 3) return 'rank-3-border';
    if (rank <= 10) return 'rank-elite-border';
    return 'border border-indrox-purple/20';
  };

  return (
    <div className="w-full space-y-8">
      {/* Filter Bar */}
      <div className="space-y-4">
        {/* Area Filter */}
        <div>
          <p className="text-sm font-bold text-indrox-gold mb-2">BY AREA</p>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => (
              <button
                key={area}
                onClick={() => setAreaFilter(area as AreaFilter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  areaFilter === area
                    ? 'bg-indrox-purple text-white'
                    : 'bg-indrox-bg-card border border-indrox-purple/20 text-indrox-cream hover:border-indrox-purple'
                }`}
              >
                {area === 'all' ? 'All Areas' : area}
              </button>
            ))}
          </div>
        </div>

        {/* Wins Filter */}
        <div>
          <p className="text-sm font-bold text-indrox-gold mb-2">BY VICTORIES</p>
          <div className="flex flex-wrap gap-2">
            {WINS_FILTERS.map((winsOpt) => (
              <button
                key={winsOpt}
                onClick={() => setWinsFilter(winsOpt)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  winsFilter === winsOpt
                    ? 'bg-indrox-purple text-white'
                    : 'bg-indrox-bg-card border border-indrox-purple/20 text-indrox-cream hover:border-indrox-purple'
                }`}
              >
                {winsOpt === 'all' ? 'All' : winsOpt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-indrox-cream/60">
        Showing {filteredParticipants.length} of {participants.length} participants
      </p>

      {/* Main Leaderboard */}
      <div ref={ref} className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${areaFilter}-${winsFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            {/* Rank #1 - Legend */}
            {rankedParticipants[0] && (
              <motion.div
                variants={itemVariants}
                layoutId="rank-1"
                className="w-full"
              >
                <ParticipantCardRank1
                  participant={rankedParticipants[0]}
                  isExpanded={expandedSlug === rankedParticipants[0].slug}
                  onToggleExpand={() =>
                    setExpandedSlug(
                      expandedSlug === rankedParticipants[0].slug
                        ? null
                        : rankedParticipants[0].slug
                    )
                  }
                />
              </motion.div>
            )}

            {/* Ranks #2 & #3 - Side by side */}
            {(rankedParticipants[1] || rankedParticipants[2]) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rankedParticipants[1] && (
                  <motion.div variants={itemVariants} layoutId="rank-2">
                    <ParticipantCardRank23
                      participant={rankedParticipants[1]}
                      isExpanded={expandedSlug === rankedParticipants[1].slug}
                      onToggleExpand={() =>
                        setExpandedSlug(
                          expandedSlug === rankedParticipants[1].slug
                            ? null
                            : rankedParticipants[1].slug
                        )
                      }
                    />
                  </motion.div>
                )}
                {rankedParticipants[2] && (
                  <motion.div variants={itemVariants} layoutId="rank-3">
                    <ParticipantCardRank23
                      participant={rankedParticipants[2]}
                      isExpanded={expandedSlug === rankedParticipants[2].slug}
                      onToggleExpand={() =>
                        setExpandedSlug(
                          expandedSlug === rankedParticipants[2].slug
                            ? null
                            : rankedParticipants[2].slug
                        )
                      }
                    />
                  </motion.div>
                )}
              </div>
            )}

            {/* Ranks #4-10 - Grid */}
            {rankedParticipants.slice(3, 10).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-indrox-gold mb-4">
                  🎯 ELITE (4-10)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rankedParticipants.slice(3, 10).map((p) => (
                    <motion.div
                      key={p.slug}
                      variants={itemVariants}
                      layoutId={p.slug}
                    >
                      <ParticipantCardStandard
                        participant={p}
                        isExpanded={expandedSlug === p.slug}
                        onToggleExpand={() =>
                          setExpandedSlug(
                            expandedSlug === p.slug ? null : p.slug
                          )
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Ranks #11+ - List */}
            {rankedParticipants.slice(10).length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-indrox-gold mb-4">
                  COMPETITORS
                </h3>
                <div className="space-y-2">
                  {rankedParticipants.slice(10).map((p) => (
                    <motion.div
                      key={p.slug}
                      variants={itemVariants}
                      className="flex items-center justify-between bg-indrox-bg-card border border-indrox-purple/20 rounded-lg p-4 hover:bg-indrox-bg-card-hover transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedSlug(
                          expandedSlug === p.slug ? null : p.slug
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-indrox-gold">
                          #{p.rank}
                        </span>
                        <img
                          src={p.photo}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-bold text-indrox-cream">
                            {p.name}
                          </p>
                          <p className="text-xs text-indrox-purple">
                            {p.area}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-indrox-gold">
                        {p.totalScore.toFixed(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {filteredParticipants.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <p className="text-indrox-cream/60">
                  No participants match your filters.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Rank #1 Card Component
function ParticipantCardRank1({
  participant,
  isExpanded,
  onToggleExpand,
}: {
  participant: ParticipantData & { rank: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <motion.div
      className="relative bg-gradient-to-b from-indrox-gold/15 to-indrox-bg-card rounded-xl p-8 rank-1-border overflow-hidden group hover:shadow-2xl hover:shadow-indrox-gold/30 transition-all"
      onClick={onToggleExpand}
    >
      <Suspense fallback={null}>
        <FireEffect width={600} height={200} intensity={0.8} />
      </Suspense>

      <div className="relative z-10 text-center">
        {/* Medal */}
        <div className="text-6xl mb-4 drop-shadow-lg">👑</div>

        {/* Photo */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indrox-gold shadow-lg shadow-indrox-gold/50 animate-pulse-gold-shadow">
          <img
            src={participant.photo}
            alt={participant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Name */}
        <h2 className="font-display text-3xl font-bold text-indrox-cream mb-2 group-hover:text-indrox-gold transition-colors">
          {participant.name}
        </h2>
        <p className="text-indrox-purple mb-4">{participant.role}</p>

        {/* Badge */}
        <div className="inline-block bg-indrox-gold/20 border border-indrox-gold px-4 py-2 rounded-full mb-6">
          <span className="text-sm font-bold text-indrox-gold">
            LEGEND • {participant.area}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indrox-bg-card/50 rounded-lg p-4 border border-indrox-gold/20">
            <div className="text-3xl font-bold text-indrox-gold">
              <AnimatedCounter value={participant.totalScore} decimals={1} />
            </div>
            <p className="text-xs text-indrox-cream/60 mt-1">Points</p>
          </div>
          <div className="bg-indrox-bg-card/50 rounded-lg p-4 border border-indrox-gold/20">
            <div className="text-3xl font-bold text-indrox-gold">
              {participant.wins}
            </div>
            <p className="text-xs text-indrox-cream/60 mt-1">Wins</p>
          </div>
          <div className="bg-indrox-bg-card/50 rounded-lg p-4 border border-indrox-gold/20">
            <div className="text-3xl font-bold text-indrox-gold">
              {participant.participations}
            </div>
            <p className="text-xs text-indrox-cream/60 mt-1">Games</p>
          </div>
        </div>

        {/* Expanded Projects */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-6 border-t border-indrox-gold/20"
            >
              <p className="text-xs text-indrox-cream/60 mb-4 font-bold">
                PROJECTS
              </p>
              <div className="space-y-3">
                {participant.projects.map((proj) => (
                  <div
                    key={proj.weekSlug}
                    className="bg-indrox-bg-card/50 rounded-lg p-4 border border-indrox-purple/20 text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-indrox-cream text-sm">
                          {proj.title}
                        </p>
                        <p className="text-xs text-indrox-purple">
                          Week {proj.week}
                        </p>
                      </div>
                      {proj.isWinner && (
                        <span className="text-lg">🏆</span>
                      )}
                    </div>
                    <div className="text-xs text-indrox-gold font-bold">
                      {proj.totalScore.toFixed(1)}/30
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Rank #2-3 Card Component
function ParticipantCardRank23({
  participant,
  isExpanded,
  onToggleExpand,
}: {
  participant: ParticipantData & { rank: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const isSilver = participant.rank === 2;

  return (
    <motion.div
      className={`relative bg-indrox-bg-card rounded-lg p-6 transition-all group hover:shadow-xl ${
        isSilver
          ? 'rank-2-border hover:shadow-indrox-silver/20'
          : 'rank-3-border hover:shadow-indrox-bronze/20'
      }`}
      onClick={onToggleExpand}
    >
      <div className="relative z-10 text-center">
        {/* Medal */}
        <div className="text-5xl mb-4">{isSilver ? '🥈' : '🥉'}</div>

        {/* Photo */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-current">
          <img
            src={participant.photo}
            alt={participant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-indrox-cream mb-2 group-hover:text-indrox-gold transition-colors">
          {participant.name}
        </h3>
        <p className="text-sm text-indrox-purple mb-4">{participant.role}</p>

        {/* Badge */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
          isSilver
            ? 'bg-indrox-silver/20 text-indrox-silver'
            : 'bg-indrox-bronze/20 text-indrox-bronze'
        }`}>
          {isSilver ? 'CHALLENGER' : 'ASPIRANT'}
        </div>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-indrox-cream/60">Points</span>
            <span className="font-bold text-indrox-gold">
              {participant.totalScore.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-indrox-cream/60">Wins</span>
            <span className="font-bold text-indrox-gold">
              {participant.wins}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-indrox-cream/60">Games</span>
            <span className="font-bold text-indrox-gold">
              {participant.participations}
            </span>
          </div>
        </div>

        {/* Expanded Projects */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 mt-4 border-t border-indrox-purple/20"
            >
              <p className="text-xs text-indrox-cream/60 mb-3 font-bold">
                PROJECTS
              </p>
              <div className="space-y-2">
                {participant.projects.map((proj) => (
                  <div
                    key={proj.weekSlug}
                    className="bg-indrox-bg/50 rounded p-3 border border-indrox-purple/10 text-left text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-indrox-cream">
                        {proj.title}
                      </p>
                      {proj.isWinner && (
                        <span>🏆</span>
                      )}
                    </div>
                    <p className="text-indrox-purple mt-1">
                      {proj.totalScore.toFixed(1)}/30
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Standard Card Component (Ranks 4+)
function ParticipantCardStandard({
  participant,
  isExpanded,
  onToggleExpand,
}: {
  participant: ParticipantData & { rank: number };
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <motion.div
      className="relative bg-indrox-bg-card rounded-lg p-4 rank-elite-border transition-all group hover:shadow-lg hover:shadow-indrox-purple/20 cursor-pointer"
      onClick={onToggleExpand}
    >
      <div className="relative z-10">
        {/* Rank badge */}
        <div className="absolute top-3 right-3 bg-indrox-purple/20 border border-indrox-purple/40 rounded-full px-2 py-1">
          <span className="text-xs font-bold text-indrox-gold">
            #{participant.rank}
          </span>
        </div>

        {/* Photo */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-indrox-purple">
          <img
            src={participant.photo}
            alt={participant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Name */}
        <h3 className="text-center font-bold text-indrox-cream group-hover:text-indrox-purple transition-colors text-sm">
          {participant.name}
        </h3>
        <p className="text-center text-xs text-indrox-purple mt-1">
          {participant.role}
        </p>

        {/* Score */}
        <div className="text-center mt-3 pt-3 border-t border-indrox-purple/20">
          <p className="text-lg font-bold text-indrox-gold">
            {participant.totalScore.toFixed(1)}
          </p>
          <p className="text-xs text-indrox-cream/60">pts • {participant.wins}W</p>
        </div>

        {/* Expanded Projects */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 mt-3 border-t border-indrox-purple/20"
            >
              <p className="text-xs text-indrox-cream/60 mb-2 font-bold">
                PROJECTS
              </p>
              <div className="space-y-1">
                {participant.projects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.weekSlug}
                    className="bg-indrox-bg/50 rounded p-2 border border-indrox-purple/10 text-left text-xs"
                  >
                    <p className="font-bold text-indrox-cream line-clamp-1">
                      {proj.title}
                    </p>
                    <p className="text-indrox-purple">
                      {proj.totalScore.toFixed(1)}/30
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
