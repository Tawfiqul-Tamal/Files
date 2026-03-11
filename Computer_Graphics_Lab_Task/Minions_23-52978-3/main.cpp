#include <GL/glut.h>
#include <math.h>

void display() {
glClear(GL_COLOR_BUFFER_BIT);
glColor3f(1, 1, 0);
    float centerX = 0.0;
    float centerY = 0.25;
    float radius = 0.5;

    glBegin(GL_POLYGON);
    for (int i = 0; i <= 180; i++) {
        float angle = i * 3.1416 / 180.0;
        float x = centerX + radius * cos(angle);
        float y = centerY + radius * sin(angle);
        glVertex2f(x, y);
    }
    glEnd();


glColor3f(1, 1, 1);
    float e1centerX = -0.15;
    float e1centerY = 0.35;
    float e1radius = 0.07;
glBegin(GL_POLYGON);
    for (int i = 0; i <= 360; i++) {
        float angle = i * 3.1416 / 180.0;
        float x = e1centerX + e1radius * cos(angle);
        float y = e1centerY + e1radius * sin(angle);
        glVertex2f(x, y);
    }
    glEnd();


glColor3f(1, 1, 1);
    float e2centerX = 0.15;
    float e2centerY = 0.35;
    float e2radius = 0.07;
glBegin(GL_POLYGON);
    for (int i = 0; i <= 360; i++) {
        float angle = i * 3.1416 / 180.0;
        float x = e2centerX + e2radius * cos(angle);
        float y = e2centerY + e2radius * sin(angle);
        glVertex2f(x, y);
    }
    glEnd();



glColor3f(0, 0, 0);
   float p1centerX = -0.15;
   float p1centerY = 0.35;
   float p1radius = 0.03;

glBegin(GL_POLYGON);
for (int i = 0; i <= 360; i++) {
    float angle = i * 3.1416 / 180.0;
    float x = p1centerX + p1radius * cos(angle);
    float y = p1centerY + p1radius * sin(angle);
    glVertex2f(x, y);
}
glEnd();


glColor3f(0, 0, 0);
   float p2centerX = 0.15;
   float p2centerY = 0.35;
   float p2radius = 0.03;

glBegin(GL_POLYGON);
for (int i = 0; i <= 360; i++) {
    float angle = i * 3.1416 / 180.0;
    float x = p2centerX + p2radius * cos(angle);
    float y = p2centerY + p2radius * sin(angle);
    glVertex2f(x, y);
}
glEnd();






glColor3f(0, 0, 1);
glBegin(GL_POLYGON);
        glVertex2f(-0.5, -0.5);
        glVertex2f(0.5, -0.5);
        glVertex2f(0.5, 0.25);
        glVertex2f(-0.5, 0.25);
    glEnd();


glColor3f(0, 0, 0);
glLineWidth(26.4);
    glBegin(GL_LINES);
        glVertex2f(-0.15, -0.5);
        glVertex2f(-0.15, -0.65);
    glEnd();


glColor3f(0, 0, 0);
glLineWidth(26.4);
    glBegin(GL_LINES);
        glVertex2f(0.15, -0.5);
        glVertex2f(0.15, -0.65);
    glEnd();


glColor3f(0, 0, 0);
glLineWidth(26.0);
    glBegin(GL_LINES);
        glVertex2f(-0.5, 0.0);
        glVertex2f(-0.7, 0.0);
    glEnd();


glColor3f(0, 0, 0);
glLineWidth(26.0);
    glBegin(GL_LINES);
        glVertex2f(0.5, 0.0);
        glVertex2f(0.7, 0.0);
    glEnd();

    glFlush();
}

void setup() {
    glClearColor(1, 1, 1, 1);

}

int main(int argc, char **argv) {
    glutInit(&argc, argv);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);

    glutCreateWindow("Tamal_Minion");

    setup();
    glutDisplayFunc(display);

    glutMainLoop();
    return 0;
}
