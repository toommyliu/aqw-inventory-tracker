// Ref: http://aqwwiki.wikidot.com/exp-class-points-rep

// Converts the total class points to the class rank
export function getClassRank(classPoints: number): number {
	if (classPoints < 900) return 1;
	else if (classPoints < 3_600) return 2;
	else if (classPoints < 10_000) return 3;
	else if (classPoints < 22_500) return 4;
	else if (classPoints < 44_100) return 5;
	else if (classPoints < 78_400) return 6;
	else if (classPoints < 129_600) return 7;
	else if (classPoints < 202_500) return 8;
	else if (classPoints < 302_500) return 9;
	return 10;
}
