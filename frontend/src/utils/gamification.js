/**
 * Gamification System
 * User badges, reputation, and achievement tracking
 */

// Badge definitions
export const BADGES = {
    rookie: {
        id: 'rookie',
        name: 'Rookie Reporter',
        description: 'Submitted your first incident',
        icon: '🆕',
        threshold: 1,
        color: 'gray'
    },
    contributor: {
        id: 'contributor',
        name: 'Active Contributor',
        description: 'Submitted 5 incidents',
        icon: '📝',
        threshold: 5,
        color: 'blue'
    },
    hero: {
        id: 'hero',
        name: 'Community Hero',
        description: 'Submitted 20 incidents',
        icon: '🦸',
        threshold: 20,
        color: 'purple'
    },
    legend: {
        id: 'legend',
        name: 'Legend',
        description: 'Submitted 50 incidents',
        icon: '⭐',
        threshold: 50,
        color: 'gold'
    },
    verifier: {
        id: 'verifier',
        name: 'Truth Seeker',
        description: 'Verified 10 incidents',
        icon: '✅',
        threshold: 10,
        color: 'green'
    },
    trusted: {
        id: 'trusted',
        name: 'Trusted Source',
        description: 'Reputation score above 50',
        icon: '🛡️',
        threshold: 50,
        color: 'cyan'
    }
};

/**
 * Calculate user level based on reputation
 */
export const calculateLevel = (reputation) => {
    if (reputation < 10) return { level: 1, name: 'Beginner', color: 'gray' };
    if (reputation < 25) return { level: 2, name: 'Contributor', color: 'blue' };
    if (reputation < 50) return { level: 3, name: 'Regular', color: 'green' };
    if (reputation < 100) return { level: 4, name: 'Veteran', color: 'purple' };
    if (reputation < 200) return { level: 5, name: 'Hero', color: 'orange' };
    return { level: 6, name: 'Legend', color: 'gold' };
};

/**
 * Get earned badges for a user
 */
export const getEarnedBadges = (user) => {
    const earned = [];

    // Reporter badges
    if (user.incidentsReported >= BADGES.rookie.threshold) earned.push(BADGES.rookie);
    if (user.incidentsReported >= BADGES.contributor.threshold) earned.push(BADGES.contributor);
    if (user.incidentsReported >= BADGES.hero.threshold) earned.push(BADGES.hero);
    if (user.incidentsReported >= BADGES.legend.threshold) earned.push(BADGES.legend);

    // Verifier badges
    if (user.incidentsVerified >= BADGES.verifier.threshold) earned.push(BADGES.verifier);

    // Reputation badges
    if (user.reputation >= BADGES.trusted.threshold) earned.push(BADGES.trusted);

    return earned;
};

/**
 * Calculate progress to next badge
 */
export const getNextBadge = (user) => {
    const reporterBadges = [BADGES.rookie, BADGES.contributor, BADGES.hero, BADGES.legend];

    for (let badge of reporterBadges) {
        if (user.incidentsReported < badge.threshold) {
            return {
                badge,
                progress: (user.incidentsReported / badge.threshold) * 100,
                remaining: badge.threshold - user.incidentsReported
            };
        }
    }

    return null; // All badges earned
};

/**
 * Award points for actions
 */
export const POINT_AWARDS = {
    REPORT_INCIDENT: 5,
    VERIFY_INCIDENT: 2,
    INCIDENT_RESOLVED: 10,
    FIRST_REPORT: 10
};

export default {
    BADGES,
    calculateLevel,
    getEarnedBadges,
    getNextBadge,
    POINT_AWARDS
};
