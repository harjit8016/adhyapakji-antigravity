import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { CheckCircle2, AlertCircle, IndianRupee } from 'lucide-react-native';

import { useAppStore } from '../../store/appStore';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import type { FeeRecord } from '../../types';
import AppText from '../../components/AppText';
import AppCard from '../../components/AppCard';
import AppButton from '../../components/AppButton';

export default function FeesScreen() {
    const fees = useAppStore(state => state.fees);
    const myChildren = useAppStore(state => state.myChildren);
    const activeStudentId = useAppStore(state => state.activeStudentId);

    const activeStudent = myChildren.find((c: any) => c.id === activeStudentId) || myChildren[0];

    // Filter fees for the active student
    const studentFees = fees.filter((f: any) => f.studentId === activeStudent.id);
    const pendingFees = studentFees.filter((f: any) => f.status === 'pending');
    const paidFees = studentFees.filter((f: any) => f.status === 'paid');

    const totalPending = pendingFees.reduce((sum: number, fee: any) => sum + fee.amount, 0);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            {/* ── Total Due Header Card (Matches Figma Gradient) ── */}
            <AppCard style={styles.totalDueCard}>
                <View style={styles.totalDueHeader}>
                    <IndianRupee size={32} color={COLORS.textLight} />
                    <AppText variant="h2" weight="500" color={COLORS.textLight}>
                        Total Due
                    </AppText>
                </View>
                <AppText weight="bold" color={COLORS.textLight} style={styles.totalAmount}>
                    ₹{totalPending.toLocaleString()}
                </AppText>
                {totalPending > 0 && (
                    <AppButton
                        title="Pay Now"
                        onPress={() => {}} // Placeholder
                        variant="secondary"
                        style={styles.payBtn}
                    />
                )}
            </AppCard>

            {/* ── Pending Fees ── */}
            {pendingFees.length > 0 && (
                <View style={styles.section}>
                    <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                        Pending Payments
                    </AppText>
                    <View style={styles.cardList}>
                        {pendingFees.map((fee: FeeRecord) => (
                            <AppCard key={fee.id} style={styles.feeCard}>
                                <View style={styles.feeCardInner}>
                                    <View style={styles.feeInfo}>
                                        <AppText weight="bold" color={COLORS.textDark} style={styles.feeDesc}>
                                            {fee.description}
                                        </AppText>
                                        <View style={styles.feeDateRow}>
                                            <AlertCircle size={16} color="#D97706" />
                                            <AppText variant="small" color={COLORS.textMuted}>
                                                Due: {fee.dueDate}
                                            </AppText>
                                        </View>
                                    </View>
                                    <View style={styles.feeAmountCol}>
                                        <AppText variant="h1" weight="bold" color={COLORS.primary}>
                                            ₹{fee.amount.toLocaleString()}
                                        </AppText>
                                    </View>
                                </View>
                            </AppCard>
                        ))}
                    </View>
                </View>
            )}

            {/* ── Payment History ── */}
            <View style={styles.section}>
                <AppText variant="h2" weight="bold" color={COLORS.textDark} style={styles.sectionTitle}>
                    Payment History
                </AppText>
                {paidFees.length === 0 ? (
                    <AppText variant="body" color={COLORS.textMuted} style={{ fontStyle: 'italic' }}>
                        No payment history.
                    </AppText>
                ) : (
                    <View style={styles.cardList}>
                        {paidFees.map((fee: FeeRecord) => (
                            <AppCard key={fee.id} style={styles.feeCard}>
                                <View style={styles.feeCardInner}>
                                    <View style={styles.feeInfo}>
                                        <AppText weight="bold" color={COLORS.textDark} style={styles.feeDesc}>
                                            {fee.description}
                                        </AppText>
                                        <View style={styles.feeDateRow}>
                                            <CheckCircle2 size={16} color={COLORS.success} />
                                            <AppText variant="small" weight="bold" color={COLORS.success}>
                                                Paid on {fee.paidDate}
                                            </AppText>
                                        </View>
                                    </View>
                                    <View style={styles.feeAmountCol}>
                                        <AppText variant="h2" weight="bold" color={COLORS.textDark}>
                                            ₹{fee.amount.toLocaleString()}
                                        </AppText>
                                        <AppText variant="small" weight="bold" color={COLORS.primary} style={styles.receiptLink}>
                                            View Receipt
                                        </AppText>
                                    </View>
                                </View>
                            </AppCard>
                        ))}
                    </View>
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl * 2,
    },
    totalDueCard: {
        backgroundColor: COLORS.primary, // Approximating the gradient
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
        borderWidth: 0,
    },
    totalDueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    totalAmount: {
        fontSize: 48,
        lineHeight: 56,
        marginBottom: SPACING.lg,
    },
    payBtn: {
        width: '100%',
        backgroundColor: COLORS.textLight, // "Secondary" in the figma reference for this block
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        marginBottom: SPACING.md,
    },
    cardList: {
        gap: SPACING.md,
    },
    feeCard: {
        padding: SPACING.lg,
    },
    feeCardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    feeInfo: {
        flex: 1,
        paddingRight: SPACING.md,
    },
    feeDesc: {
        marginBottom: SPACING.xs,
        fontSize: 16,
    },
    feeDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    feeAmountCol: {
        alignItems: 'flex-end',
    },
    receiptLink: {
        marginTop: SPACING.xs,
        textDecorationLine: 'underline',
    },
});
