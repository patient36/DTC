export const userData = {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date("2023-01-01"),
    paidUntil: new Date("2025-12-31"),
    usedStorage: .0201,
    capsules: {
        total: 120,
        delivered: 70,
        pending: 50
    },
    payments: [
        { id: "p1", amount: 5.0, status: "FAILED", createdAt: "2024-01-15" },
        { id: "p2", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p3", amount: 5.0, status: "SUCCESS", createdAt: "2024-01-15" },
        { id: "p4", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p5", amount: 5.0, status: "SUCCESS", createdAt: "2024-01-15" },
        { id: "p6", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p7", amount: 5.0, status: "SUCCESS", createdAt: "2024-01-15" },
        { id: "p8", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p9", amount: 5.0, status: "SUCCESS", createdAt: "2024-01-15" },
        { id: "p10", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p11", amount: 5.0, status: "SUCCESS", createdAt: "2024-01-15" },
        { id: "p12", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p13", amount: 2.5, status: "FAILED", createdAt: "2024-03-20" },
        { id: "p14", amount: 2.5, status: "PENDING", createdAt: "2024-03-20" },
        { id: "p15", amount: 2.5, status: "FAILED", createdAt: "2024-03-20" },
    ]
};