-- CreateTable
CREATE TABLE "user" (
    "user_name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "password" VARCHAR(255) NOT NULL,
    "access_code" INTEGER NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
