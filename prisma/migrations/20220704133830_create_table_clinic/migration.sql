-- CreateTable
CREATE TABLE "clinic" (
    "id" UUID NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "name" VARCHAR(100) NOT NULL,
    "code" INTEGER NOT NULL,

    CONSTRAINT "clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinic_email_key" ON "clinic"("email");
