#include <GL/glut.h>
#include <math.h>

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glBegin(GL_POLYGON);
        glColor3f(0,0,1);
        glVertex2f(0.0,0.0);
        glVertex2f(0.5, 0.0);
        glVertex2f(0.5,0.5);
        glVertex2f(0, 0.5);
        glEnd();


        float centerX= 0.8;
        float centerY= 0.8;
        float radius= 0.15;

        glBegin(GL_POLYGON);

        glColor3f(1,1,0);

        for(int i=0; i<360; i++)
        {
            float angle = i* 3.1416/180;

            float x = centerX + radius * cos(angle);
            float y = centerY + radius * sin(angle);

            glVertex2f(x,y);
        }

        glEnd();


        glBegin(GL_TRIANGLES);
        glColor3f(1,0,0);
        glVertex2f(0.0,0.5);
        glVertex2f(0.5,0.5);
        glVertex2f(0.25,0.8);
        glEnd();

    glFlush();
}


void setup(){

    glClearColor(1,1,1,1);
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("Tamal");
    setup();
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}
